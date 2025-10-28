import { useEffect } from "react";
import { obtieneMercadoCajas } from "../../services/index";
import { useMercadoStore } from "../../store/mercadoStore";
import { MdPointOfSale } from "react-icons/md";

export default function PosCard() {
  const cajas = useMercadoStore((state: any) => state.cajas);
  const setCajas = useMercadoStore((state: any) => state.setCajas);

  useEffect(() => {
    // Solo buscar si no hay cajas en el store
    if (cajas && cajas.length > 0) return;
    (async () => {
      try {
        const response = await obtieneMercadoCajas();
        if (response && response.data && Array.isArray(response.data.results)) {
          setCajas(response.data.results);
        } else {
          setCajas([]);
        }
      } catch (error) {
        setCajas([]);
        console.error("Error obteniendo cajas:", error);
      }
    })();
  }, [setCajas, cajas]);

  return (
    <div className="flex flex-col flex-1 gap-2 bg-[#23262F] border border-[#2d3344] shadow rounded-lg p-4">
      <h3 className="mb-2 text-base font-semibold text-blue-300 flex items-center gap-2">
        <MdPointOfSale className="text-xl text-blue-400" />
        Cajas
      </h3>
      {cajas.length === 0 ? (
        <div className="italic text-sm text-gray-400">
          (Aquí se mostrarán las cajas asociadas a tu cuenta)
        </div>
      ) : (
        <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-1">
          {cajas.map((caja: any) => (
            <div
              key={caja.id}
              className="bg-[#232a3a] border border-[#2d3344] rounded p-3 shadow-sm flex flex-col gap-1"
            >
              <div className="font-semibold text-blue-200 text-base mb-1">{caja.name}</div>
              <div className="text-sm text-gray-400 mb-1">
                ID: <span className="font-bold text-white">{caja.id}</span>
              </div>
              <div className="text-sm text-gray-400 mb-1">
                Pertenece a sucursal:{" "}
                <span className="font-bold text-white">
                  {caja.external_store_id || caja.store_id}
                </span>
              </div>
              <div className="text-xs text-gray-500 mb-1">
                Store ID: <span className="text-gray-400">{caja.store_id}</span>
              </div>
              {caja.external_id && (
                <div className="text-sm text-amber-400 mb-1">
                  External ID: <span className="font-bold text-amber-500">{caja.external_id}</span>
                </div>
              )}
              {caja.qr?.image && (
                <div className="flex items-center gap-2 mt-2">
                  <img
                    src={caja.qr.image}
                    alt="QR"
                    className="w-16 h-16 bg-white rounded p-1 border border-gray-700"
                  />
                  <a
                    href={caja.qr.template_document}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 underline ml-2"
                  >
                    Descargar PDF QR
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
