import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import api from "../../../lib/api";

export default function ProtectedRoute() {
  const [valid, setValid] = useState<null | boolean>(null);

  useEffect(() => {
    const validate = async () => {
      const accessToken = Cookies.get("access_token");

      if (!accessToken) {
        setValid(false);
        return;
      }

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
    };

    validate();
  }, []);

  if (valid === null) return null;
  if (!valid) return <Navigate to="/" replace />;
  return <Outlet />;
}
