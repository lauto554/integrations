import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const menuItems = [
    {
      label: "Inicio",
      path: "/",
    },
    {
      label: "Mercado Pago",
      path: "/mercado-pago",
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-[#181A20] border-r border-[#23262F] flex flex-col">
      {/* Header */}
      <div className="h-16 flex items-center px-6 border-b border-[#23262F]">
        <span className="font-extrabold text-xl tracking-tight text-blue-400 cursor-default">
          Integrations
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 px-2 py-3">
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

      {/* Footer */}
      <div className="px-6 py-4 border-t border-[#23262F] text-xs text-gray-500 cursor-default">
        © {new Date().getFullYear()} lauto554
      </div>
    </aside>
  );
}
