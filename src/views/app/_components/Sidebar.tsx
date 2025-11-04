import { useNavigate } from "react-router-dom";
import { FiLogOut, FiHome } from "react-icons/fi";
import { useState } from "react";
import Cookies from "js-cookie";

type ContextualButton = {
  key: string;
  label: string;
  path: string;
};

type SectionKey = "Inicio" | "Mercado Pago";

export default function Sidebar() {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState<SectionKey>("Inicio");

  const menuItems = [
    {
      label: "Inicio",
      icon: <FiHome className="w-6 h-6 shrink-0" />,
      color: "text-blue-400",
    },
    {
      label: "Mercado Pago",
      icon: <img src="/mercadopago.png" alt="Logo MP" className="w-6 h-6 bg-white rounded-full" />,
      color: "text-blue-400",
    },
  ];

  const contextualMenus: Record<SectionKey, ContextualButton[]> = {
    Inicio: [
      {
        key: "inicio",
        label: "Ir a Inicio",
        path: "/dashboard",
      },
    ],
    "Mercado Pago": [
      {
        key: "dashboard",
        label: "Dashboard",
        path: "/dashboard/mercado-pago/inicio",
      },
      {
        key: "stores",
        label: "Sucursales",
        path: "/dashboard/mercado-pago/stores",
      },
      {
        key: "pos",
        label: "Cajas",
        path: "/dashboard/mercado-pago/pos",
      },
      {
        key: "devices",
        label: "Terminales",
        path: "/dashboard/mercado-pago/devices",
      },
      {
        key: "orders",
        label: "Ordenes de Pago",
        path: "/dashboard/mercado-pago/orders",
      },
      // Agrega aquí más botones contextuales para Mercado Pago si lo deseas
    ],
  };

  const [selectedContextKey, setSelectedContextKey] = useState(contextualMenus["Inicio"][0].key);

  const logoutItem = {
    label: "Log Out",
    path: null,
    icon: <FiLogOut className="w-6 h-6 shrink-0" />,
    action: () => {
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      navigate("/");
    },
    color: "text-gray-400",
  };

  return (
    <div className="flex flex-row min-h-screen">
      {/* Bloque lateral fijo */}
      <div className="group/sidebar flex flex-col justify-between items-center w-9  hover:w-40 transition-all duration-300 bg-[#15161b] border-r border-[#23262F] py-4 fixed left-0 top-0 bottom-0 z-30 overflow-hidden">
        <div className="flex flex-col gap-2 w-full">
          {menuItems.map((item) => (
            <button
              key={item.label}
              className={`flex items-center w-full h-10 hover:bg-blue-900/40 pl-1 pr-2 transition-colors duration-200 mt-1 ${
                item.color
              } ${selectedSection === item.label ? "bg-blue-900/60" : ""}`}
              onClick={() => {
                const sectionKey = item.label as SectionKey;
                setSelectedSection(sectionKey);
                // Al cambiar de sección, selecciona el primer botón contextual de esa sección
                const firstContext = contextualMenus[sectionKey]?.[0];
                if (firstContext) {
                  setSelectedContextKey(firstContext.key);
                  navigate(firstContext.path);
                }
              }}
            >
              {item.icon}
              <span
                className={
                  `ml-1.5 text-white text-sm font-semibold transition-all duration-200 whitespace-nowrap ` +
                  `max-w-0 group-hover/sidebar:max-w-xs group-hover/sidebar:opacity-100 opacity-0 ` +
                  `${selectedSection === item.label ? "group-hover/sidebar:opacity-100" : ""}`
                }
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>

        <button
          className={`flex items-center w-full h-10 rounded-lg hover:bg-blue-900/40 transition-colors duration-200 mb-2 ${logoutItem.color}`}
          onClick={logoutItem.action}
        >
          {logoutItem.icon}
          <span className="ml-1.5 text-white text-sm font-semibold opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            {logoutItem.label}
          </span>
        </button>
      </div>

      {/* Sidebar principal desplazado */}
      <aside className="flex flex-col w-64 min-h-screen bg-[#181A20] border-r border-[#23262F] ml-9">
        {/* Header */}
        <div className="flex h-16 items-center px-6 border-b border-[#23262F]">
          <span className="font-extrabold text-xl tracking-tight text-blue-400 cursor-default">
            {menuItems.find((item) => item.label === selectedSection)?.label || "Demo's Dashboard"}
          </span>
        </div>

        {/* Navigation: renderiza los botones contextuales según la sección seleccionada */}
        <nav className="flex flex-col flex-1 gap-1 px-2 py-3">
          {contextualMenus[selectedSection]?.map((btn: ContextualButton) => (
            <button
              key={btn.key}
              className={`flex items-center w-full h-10 rounded-lg pl-1 pr-2 transition-colors duration-200 mt-1 text-blue-400 ${
                selectedContextKey === btn.key ? "bg-blue-900/60" : "hover:bg-blue-900/40"
              }`}
              onClick={() => {
                setSelectedContextKey(btn.key);
                if (btn.path) navigate(btn.path);
              }}
            >
              <span className="ml-1.5 text-white text-sm font-semibold">{btn.label}</span>
            </button>
          ))}
        </nav>

        {/* Log Out Button y copyright movido al bloque lateral */}
        <div className="px-6 py-4 border-t border-[#23262F]">
          <div className="mt-4 text-xs text-gray-500 cursor-default text-start">
            © {new Date().getFullYear()} lauto554
          </div>
        </div>
      </aside>
    </div>
  );
}
