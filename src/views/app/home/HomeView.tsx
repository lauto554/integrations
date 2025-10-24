export default function HomeView() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center py-10 px-2">
      <div className="mb-10 w-full max-w-3xl">
        <p className="text-white text-lg md:text-2xl font-semibold mb-6 text-center cursor-default">
          Plataforma para centralizar integraciones técnicas de terceros y automatizar procesos
          empresariales.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 cursor-default">
          <div className="bg-[#23262F] rounded-xl shadow p-5 flex flex-col items-center border border-[#2d3344] cursor-default">
            <span className="text-blue-300 font-bold text-lg mb-1 cursor-default">
              Cobros / Ventas
            </span>
            <span className="text-blue-400 text-sm font-semibold mb-1 cursor-default">
              Clover, MercadoPago
            </span>
          </div>
          <div className="bg-[#23262F] rounded-xl shadow p-5 flex flex-col items-center border border-[#2d3344] cursor-default">
            <span className="text-blue-300 font-bold text-lg mb-1 cursor-default">Contacto</span>
            <span className="text-blue-400 text-sm font-semibold mb-1 cursor-default">
              Sendgrid, Meta
            </span>
          </div>
          <div className="bg-[#23262F] rounded-xl shadow p-5 flex flex-col items-center border border-[#2d3344] cursor-default">
            <span className="text-blue-300 font-bold text-lg mb-1 cursor-default">
              Storage Remoto
            </span>
            <span className="text-blue-400 text-sm font-semibold mb-1 cursor-default">Dropbox</span>
          </div>
          <div className="bg-[#23262F] rounded-xl shadow p-5 flex flex-col items-center border border-[#2d3344] cursor-default">
            <span className="text-blue-300 font-bold text-lg mb-1 cursor-default">
              Facturación Fiscal
            </span>
            <span className="text-blue-400 text-sm font-semibold mb-1 cursor-default">
              Arca, AFIP
            </span>
          </div>
          <div className="bg-[#23262F] rounded-xl shadow p-5 flex flex-col items-center border border-[#2d3344] cursor-default">
            <span className="text-blue-300 font-bold text-lg mb-1 cursor-default">
              Controlador Fiscal
            </span>
            <span className="text-blue-400 text-sm font-semibold mb-1 cursor-default">Epson</span>
          </div>
        </div>
      </div>
    </div>
  );
}
