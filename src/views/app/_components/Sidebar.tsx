import { useNavigate, useLocation } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import Cookies from "js-cookie";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      label: "Inicio",
      path: "/dashboard",
    },
    {
      label: "Mercado Pago",
      path: "/dashboard/mercado-pago",
    },
  ];

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-[#181A20] border-r border-[#23262F] ">
      {/* Header */}
      <div className="flex h-16 items-center px-6 border-b border-[#23262F]">
        <span className="font-extrabold text-xl tracking-tight text-blue-400 cursor-default">
          Integrations
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col flex-1 gap-1 px-2 py-3">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.label}
              className={`flex items-center px-3 py-1.5 rounded-md font-medium transition border border-transparent shadow-sm cursor-pointer text-sm ${
                isActive
                  ? "bg-blue-900/80 text-blue-300 border-blue-500"
                  : "text-gray-100 bg-[#23262F] hover:bg-blue-900/60 hover:border-blue-500"
              }`}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Log Out Button */}
      <div className="px-6 py-4 border-t border-[#23262F]">
        <button
          className="w-full flex items-start gap-2 justify-start py-2 px-3 rounded-md bg-transparent text-gray-400 hover:text-blue-400 font-semibold text-sm transition cursor-pointer"
          onClick={() => {
            Cookies.remove("access_token");
            Cookies.remove("refresh_token");
            navigate("/");
          }}
        >
          <FiLogOut className="h-5 w-5" />
          Log Out
        </button>
        <div className="mt-4 text-xs text-gray-500 cursor-default text-start">
          © {new Date().getFullYear()} lauto554
        </div>
      </div>
    </aside>
  );
}
