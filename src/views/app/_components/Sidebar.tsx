export default function Sidebar() {
  const menuItems = [
    {
      label: "Mercado Pago",
      icon: (
        <span className="flex items-center justify-center h-10 w-10 bg-white rounded-full">
          <img
            src="/mercadopago.png"
            alt="Mercado Pago logo"
            className="h-8 w-auto object-contain"
            draggable={false}
          />
        </span>
      ),
      onClick: () => {},
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
      <nav className="flex-1 flex flex-col gap-2 px-2 py-4">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className="flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-gray-100 bg-[#23262F] hover:bg-blue-900/60 transition border border-transparent hover:border-blue-500 shadow-sm cursor-pointer"
            onClick={item.onClick}
          >
            {item.icon}
            <span className="text-base">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-[#23262F] text-xs text-gray-500 cursor-default">
        © {new Date().getFullYear()} lauto554
      </div>
    </aside>
  );
}
