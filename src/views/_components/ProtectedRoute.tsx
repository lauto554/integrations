import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import api from "../../lib/api";

export default function ProtectedRoute() {
  const [valid, setValid] = useState<null | boolean>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validate = async () => {
      const accessToken = Cookies.get("access_token");

      if (!accessToken) {
        setValid(false);
        setLoading(false);
        return;
      }

      try {
        const request = await api("/auth/validate-token", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (request.data.code !== 200) {
          setValid(false);
        } else {
          setValid(true);
        }
      } catch (err) {
        setValid(false);
      } finally {
        setLoading(false);
      }
    };

    validate();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <span className="text-gray-500 text-lg">Validando sesión...</span>
      </div>
    );
  }

  if (!valid) return <Navigate to="/" replace />;
  return <Outlet />;
}
