import { useEffect } from "react";
import { MdStore } from "react-icons/md";
import { obtieneMercadoSucursales } from "../../services/index";
import { useMercadoStore } from "../../store/mercadoStore";

export default function SucursalesCard() {
  const datosUserMp = useMercadoStore((state) => state.datosUserMp);
  const setSucursales = useMercadoStore((state) => state.setSucursales);
  const sucursales = useMercadoStore((state) => state.sucursales);

  useEffect(() => {
    // Solo buscar si no hay sucursales en el store
    if (sucursales && sucursales.length > 0) return;
    const user_id = datosUserMp?.user_id || datosUserMp?.data?.id;
    if (user_id) {
      (async () => {
        try {
          const response = await obtieneMercadoSucursales(user_id);
          if (response && response.data && Array.isArray(response.data.results)) {
            setSucursales(response.data.results);
          } else {
            setSucursales([]);
          }
        } catch (error) {
          setSucursales([]);
          console.error("Error obteniendo sucursales:", error);
        }
      })();
    } else {
      setSucursales([]);
    }
  }, [datosUserMp, setSucursales, sucursales]);

  return (
    <div className="flex flex-col flex-1 gap-2 bg-[#23262F] border border-[#2d3344] shadow rounded-lg p-4">
      <h3 className="mb-2 text-base font-semibold text-blue-300 flex items-center gap-2">
        <MdStore className="text-xl text-blue-400" />
        Sucursales
      </h3>
      {sucursales.length === 0 ? (
        <div className="italic text-sm text-gray-400">
          (Aquí se mostrarán las sucursales asociadas a tu cuenta)
        </div>
      ) : (
        <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-1">
          {sucursales.map((suc) => (
            <div
              key={suc.id}
              className="bg-[#232a3a] border border-[#2d3344] rounded p-3 shadow-sm flex flex-col gap-1"
            >
              <div className="font-semibold text-blue-200 text-base mb-1">{suc.name}</div>
              <div className="text-sm text-gray-400 mb-1">
                ID: <span className="font-bold text-white">{suc.id}</span>
              </div>
              <div className="text-sm text-gray-400 mb-1">
                Dirección:{" "}
                <span className="font-bold text-white">{suc.location?.address_line}</span>
              </div>
              {suc.location?.city && (
                <div className="text-sm text-gray-400 mb-1">
                  Ciudad: <span className="font-bold text-white">{suc.location.city}</span>
                </div>
              )}
              {suc.location?.state_id && (
                <div className="text-sm text-gray-400 mb-1">
                  Provincia: <span className="font-bold text-white">{suc.location.state_id}</span>
                </div>
              )}
              {suc.external_id && (
                <div className="text-sm text-amber-400 mb-1">
                  External ID: <span className="font-bold text-amber-500">{suc.external_id}</span>
                </div>
              )}
              {/* {suc.business_hours && (
                <div className="flex flex-col text-xs text-gray-400 mt-2">
                  <span className="font-semibold text-blue-300">Horarios:</span>{" "}
                  {Object.keys(suc.business_hours).map((dia, idxDia, arrDias) => {
                    const diasEs: Record<string, string> = {
                      monday: "Lunes",
                      tuesday: "Martes",
                      wednesday: "Miércoles",
                      thursday: "Jueves",
                      friday: "Viernes",
                      saturday: "Sábado",
                      sunday: "Domingo",
                    };
                    return (
                      <span key={dia}>
                        {diasEs[dia] || dia}:{" "}
                        {suc.business_hours[dia].map(
                          (
                            h: { open: string; close: string },
                            idx: number,
                            arr: { open: string; close: string }[]
                          ) => (
                            <span key={h.open + h.close}>
                              <span className="font-bold text-white">{h.open}</span>-
                              <span className="font-bold text-white">{h.close}</span>
                              {idx < arr.length - 1 ? ", " : ""}
                            </span>
                          )
                        )}
                        {idxDia < arrDias.length - 1 ? " | " : ""}
                      </span>
                    );
                  })}
                </div>
              )} */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
