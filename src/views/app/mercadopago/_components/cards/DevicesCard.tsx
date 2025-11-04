import { useEffect, useState } from "react";
import { obtieneMercadoTerminales, cambiarModoTerminal } from "../../services";
import { useMercadoStore } from "../../store/mercadoStore";
import { FaCashRegister } from "react-icons/fa";
import { showSwalDarkMode } from "../swalDark";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import Modal from "../../../_components/Modal";

export default function DevicesCard() {
  const terminales = useMercadoStore((s) => s.terminales);
  const setTerminales = useMercadoStore((s) => s.setTerminales);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<any>(null);
  const [showDetails, setShowDetails] = useState<string | false>(false);
  const [isChanging, setIsChanging] = useState(false);
  const [shouldRefresh, setShouldRefresh] = useState(false);

  const { mutate } = useMutation({
    mutationFn: ({ device_id, mode }: { device_id: string; mode: string }) =>
      cambiarModoTerminal(device_id, mode),
    onError: (error) => {
      console.error("Error cambiando modo de operación:", error);
      setIsChanging(false);
      showSwalDarkMode({
        title: "Error",
        text: "Error cambiando modo de operación",
        icon: "error",
      });
    },
    onMutate: () => {
      setIsChanging(true);
    },
    onSuccess: () => {
      setShouldRefresh(true);
      setIsChanging(false);
      setModalOpen(false);
      showSwalDarkMode({
        title: "¡Éxito!",
        text: "Debe reiniciar el dispositivo para que tome el nuevo modo de operación.",
        icon: "success",
      });
    },
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await obtieneMercadoTerminales();

        if (res && Array.isArray(res.data)) {
          setTerminales(res.data);
        } else {
          setTerminales([]);
        }

        if (shouldRefresh) {
          setShouldRefresh(false);
        }
      } catch (err) {
        setTerminales([]);
        console.error("Error obteniendo terminales:", err);
        // Reset refresh flag even on error
        if (shouldRefresh) {
          setShouldRefresh(false);
        }
      }
    })();
    // eslint-disable-next-line
  }, [setTerminales, shouldRefresh]);

  function handleChangeMode() {
    if (selectedDevice) {
      const targetMode = selectedDevice.operating_mode === "PDV" ? "STANDALONE" : "PDV";

      mutate({
        device_id: selectedDevice.id,
        mode: targetMode,
      });
    }
  }

  return (
    <div className="flex flex-col flex-1 gap-2 bg-[#23262F] border border-[#2d3344] shadow rounded-lg p-4">
      <h3 className="mb-4 text-lg font-bold text-blue-300 flex items-center gap-2">
        <FaCashRegister className="text-2xl text-gray-200" />
        Terminales POS
      </h3>
      {terminales.length === 0 ? (
        <div className="italic text-sm text-gray-400">
          (Aquí se mostrarán las terminales asociadas a tu cuenta)
        </div>
      ) : (
        <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-1">
          {terminales.map((term: any) => (
            <div
              key={term.id}
              className="bg-[#232a3a] border border-[#2d3344] rounded p-3 shadow-sm flex flex-col gap-2"
            >
              {[
                { label: "ID", value: term.id, color: "text-white" },
                { label: "Store ID", value: term.store_id, color: "text-white" },
                { label: "POS ID", value: term.pos_id, color: "text-white" },
                { label: "Modo", value: term.operating_mode, color: "text-amber-400" },
              ].map((field, index) => (
                <div key={index} className="flex text-sm mb-1">
                  <span className="w-16 text-right text-gray-400 mr-3">{field.label}:</span>
                  <span className={`font-bold ${field.color}`}>{field.value}</span>
                </div>
              ))}
              <button
                className="mt-2 w-fit px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition"
                onClick={() => {
                  setSelectedDevice(term);
                  setModalOpen(true);
                }}
              >
                Cambiar Modo de Operación
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal para cambiar modo de operación */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="w-150 h-100 flex flex-col">
          <h3 className="text-xl font-bold text-blue-300 mb-4">Cambiar modo de operación</h3>

          <p className="text-sm text-white mb-2">
            El modo de operación determina la arquitectura de integración con Mercado Pago. PDV
            habilita el control remoto via API, mientras que STANDALONE requiere gestión local en
            cada terminal.
          </p>

          <div className="flex-1 overflow-y-auto p-4 bg-[#1a1e2a] border border-[#2d3344] rounded-lg mb-4">
            <h4 className="text-blue-200 font-semibold text-sm mb-3">
              Modos de operación disponibles:
            </h4>

            <div className="space-y-3">
              <div className="mb-3">
                <button
                  className="w-full flex items-center justify-between text-left hover:bg-[#0f1419] p-2 rounded transition"
                  onClick={() => setShowDetails(showDetails === "PDV" ? false : "PDV")}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-green-400 text-xs">PDV</span>
                    <span className="text-xs text-gray-400">(Point of Sale)</span>
                  </div>
                  {showDetails === "PDV" ? (
                    <FaChevronUp className="text-xs text-gray-400" />
                  ) : (
                    <FaChevronDown className="text-xs text-gray-400" />
                  )}
                </button>
                {showDetails === "PDV" && (
                  <p className="text-xs text-gray-300 leading-relaxed mt-2 px-2">
                    Integración completa con el sistema de ventas. El dispositivo recibe órdenes de
                    pago automáticamente desde la aplicación, permitiendo un flujo de trabajo
                    centralizado y control total sobre las transacciones.
                  </p>
                )}
              </div>

              <div className="mb-3">
                <button
                  className="w-full flex items-center justify-between text-left hover:bg-[#0f1419] p-2 rounded transition"
                  onClick={() =>
                    setShowDetails(showDetails === "STANDALONE" ? false : "STANDALONE")
                  }
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-400 text-xs">STANDALONE</span>
                    <span className="text-xs text-gray-400">(Independiente)</span>
                  </div>
                  {showDetails === "STANDALONE" ? (
                    <FaChevronUp className="text-xs text-gray-400" />
                  ) : (
                    <FaChevronDown className="text-xs text-gray-400" />
                  )}
                </button>
                {showDetails === "STANDALONE" && (
                  <p className="text-xs text-gray-300 leading-relaxed mt-2 px-2">
                    Operación manual independiente. El dispositivo funciona de forma autónoma,
                    requiriendo intervención manual para procesar pagos. Ideal para configuraciones
                    descentralizadas o puntos de venta auxiliares.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex text-sm mb-2">
              <span className="w-22 text-right text-gray-400 mr-3">Terminal:</span>
              <span className="font-bold text-white">{selectedDevice?.id}</span>
            </div>
            <div className="flex text-sm mb-4">
              <span className="w-22 text-right text-gray-400 mr-3">Modo actual:</span>
              <span className="font-bold text-amber-400">{selectedDevice?.operating_mode}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded font-semibold transition flex items-center gap-2"
              onClick={() => {
                handleChangeMode();
              }}
              disabled={isChanging}
            >
              {isChanging ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Cambiando...
                </>
              ) : (
                `Cambiar a ${selectedDevice?.operating_mode === "PDV" ? "STANDALONE" : "PDV"}`
              )}
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
