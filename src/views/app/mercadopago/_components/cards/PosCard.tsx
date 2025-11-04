import { useState } from "react";
import { obtieneMercadoCajas, asignarPosId } from "../../services/index";
import { MdPointOfSale } from "react-icons/md";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { showSwalDarkMode } from "../swalDark";
import { useQuery, useMutation } from "@tanstack/react-query";
import Modal from "../../../_components/Modal";

export default function PosCard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCaja, setSelectedCaja] = useState<any>(null);
  const [externalId, setExternalId] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);

  const { mutate } = useMutation({
    mutationFn: ({ posId, externalId }: { posId: string; externalId: string }) =>
      asignarPosId(posId, externalId),
    onError: (error: any) => {
      console.error("Error asignando External ID:", error);
      showSwalDarkMode({
        title: "Error",
        text: "Error asignando External ID",
        icon: "error",
      });
    },
    onSuccess: () => {
      refetch(); // Actualizar la lista de cajas
      showSwalDarkMode({
        title: "¡Éxito!",
        text: "External ID asignado correctamente.",
        icon: "success",
      });
      setModalOpen(false);
    },
  });

  const {
    data: cajas = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["cajas"],
    queryFn: async () => {
      const response = await obtieneMercadoCajas();
      if (response && response.data && Array.isArray(response.data.results)) {
        return response.data.results;
      }
      return [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  function handleAssignExternalId() {
    if (selectedCaja && externalId.trim()) {
      mutate({
        posId: selectedCaja.id,
        externalId: externalId.trim(),
      });
    }
  }

  return (
    <div className="flex flex-col flex-1 gap-2 bg-[#23262F] border border-[#2d3344] shadow rounded-lg p-4">
      <h3 className="mb-2 text-base font-semibold text-blue-300 flex items-center gap-2">
        <MdPointOfSale className="text-xl text-blue-400" />
        Cajas
      </h3>
      {isLoading ? (
        <div className="text-sm text-gray-400 flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          Cargando cajas...
        </div>
      ) : error ? (
        <div className="text-sm text-red-400">Error al cargar las cajas</div>
      ) : cajas.length === 0 ? (
        <div className="italic text-sm text-gray-400">
          (Aquí se mostrarán las cajas asociadas a tu cuenta)
        </div>
      ) : (
        <div className="flex flex-col gap-3 max-h-100 overflow-y-auto pr-1">
          {cajas.map((caja: any) => {
            const fields = [
              { label: "ID", value: caja.id, color: "text-white", show: true },
              {
                label: "Sucursal",
                value: caja.external_store_id || caja.store_id,
                color: "text-white",
                show: true,
              },
              {
                label: "Store ID",
                value: caja.store_id,
                color: "text-gray-400",
                size: "text-xs",
                show: true,
              },
              {
                label: "External ID",
                value: caja.external_id,
                color: "text-amber-500",
                labelColor: "text-amber-400",
                show: !!caja.external_id,
              },
            ];

            return (
              <div
                key={caja.id}
                className="bg-[#232a3a] border border-[#2d3344] rounded p-3 shadow-sm flex flex-col gap-2"
              >
                <div className="font-semibold text-blue-200 text-base mb-2">{caja.name}</div>

                {fields
                  .filter((field) => field.show)
                  .map((field, index) => (
                    <div key={index} className={`flex mb-1 ${field.size || "text-sm"}`}>
                      <span
                        className={`w-20 text-right mr-3 ${field.labelColor || "text-gray-400"}`}
                      >
                        {field.label}:
                      </span>
                      <span className={`font-bold ${field.color}`}>{field.value}</span>
                    </div>
                  ))}

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
                {!caja.external_id && (
                  <button
                    className="mt-2 w-fit px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition"
                    onClick={() => {
                      setSelectedCaja(caja);
                      setExternalId(caja.external_id || "");
                      setModalOpen(true);
                    }}
                  >
                    Asignar External ID
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal para asignar External ID */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="w-150 flex flex-col">
          <h3 className="text-xl font-bold text-blue-300 mb-4">Asignar External ID a Caja</h3>

          <div className="bg-[#1a1e2a] border border-[#2d3344] rounded-lg p-4 mb-4 overflow-y-auto">
            <button
              className="w-full flex items-center justify-between text-left hover:bg-[#0f1419] p-2 rounded transition"
              onClick={() => setShowExplanation(!showExplanation)}
            >
              <h4 className="text-blue-200 font-semibold text-sm">
                ¿Para qué sirve el External ID?
              </h4>
              {showExplanation ? (
                <FaChevronUp className="text-sm text-gray-400" />
              ) : (
                <FaChevronDown className="text-sm text-gray-400" />
              )}
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                showExplanation ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="mt-3 px-2">
                <p className="text-xs text-gray-300 leading-relaxed mb-3">
                  El <span className="font-semibold text-blue-300">External ID</span> es una
                  referencia única que permite identificar esta caja/POS en tu sistema interno. Es
                  especialmente útil cuando trabajas con la API de Mercado Pago para:
                </p>
                <ul className="text-xs text-gray-300 leading-relaxed ml-4 space-y-1">
                  <li>
                    • <span className="text-blue-300">Identificar</span> de qué caja provienen las
                    órdenes de pago
                  </li>
                  <li>
                    • <span className="text-blue-300">Vincular</span> las transacciones con tu
                    sistema de punto de venta
                  </li>
                  <li>
                    • <span className="text-blue-300">Facilitar</span> la gestión y reportes por
                    caja individual
                  </li>
                </ul>
                <p className="text-xs text-amber-300 mt-3">
                  <span className="font-semibold">Nota:</span> Solo es necesario para integraciones
                  vía API.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex text-sm mb-2">
              <span className="w-22 text-right text-gray-400 mr-3">Caja:</span>
              <span className="font-bold text-white">{selectedCaja?.name}</span>
            </div>
            <div className="flex text-sm mb-4">
              <span className="w-22 text-right text-gray-400 mr-3">ID MP:</span>
              <span className="font-bold text-blue-300">{selectedCaja?.id}</span>
            </div>

            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-gray-300">External ID (tu referencia interna):</label>
              <button
                type="button"
                className="px-2 py-1 text-xs bg-gray-600 hover:bg-gray-500 text-white rounded transition"
                onClick={() => {
                  const randomId = Math.random().toString(36).substring(2, 7).toUpperCase();
                  setExternalId(randomId);
                }}
              >
                Asignar aleatoriamente
              </button>
            </div>
            <input
              type="text"
              className="w-full px-3 py-2 bg-[#232a3a] border border-[#2d3344] rounded text-white text-sm focus:outline-none focus:border-blue-500"
              placeholder="Ej: CAJA01, PRINCIPAL, MOSTRADOR, etc."
              value={externalId}
              onChange={(e) => setExternalId(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <button
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded font-semibold transition"
              onClick={handleAssignExternalId}
              disabled={!externalId.trim()}
            >
              Asignar
            </button>
            <button
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded font-semibold transition"
              onClick={() => setModalOpen(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
