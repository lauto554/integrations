import { useState } from "react";
import { MdStore } from "react-icons/md";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { asignarStoreId, obtieneMercadoSucursales } from "../../services/index";
import { useMercadoStore } from "../../store/mercadoStore";
import { showSwalDarkMode } from "../swalDark";
import { useMutation, useQuery } from "@tanstack/react-query";
import Modal from "../../../_components/Modal";

export default function SucursalesCard() {
  const datosUserMp = useMercadoStore((state) => state.datosUserMp);
  const user_id = datosUserMp?.user_id || datosUserMp?.data?.id;
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSucursal, setSelectedSucursal] = useState<any>(null);
  const [externalId, setExternalId] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);

  const { mutate } = useMutation({
    mutationFn: ({
      userId,
      storeId,
      externalId,
    }: {
      userId: string;
      storeId: string;
      externalId: string;
    }) => asignarStoreId(userId, storeId, externalId),
    onError: (error: any) => {
      console.error("Error asignando External ID:", error);
      showSwalDarkMode({
        title: "Error",
        text: "Error asignando External ID",
        icon: "error",
      });
    },
    onSuccess: () => {
      refetch(); // Actualizar la lista de sucursales
      showSwalDarkMode({
        title: "¡Éxito!",
        text: "External ID asignado correctamente.",
        icon: "success",
      });
      setModalOpen(false);
    },
  });

  const {
    data: sucursales = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["sucursales", user_id],
    queryFn: async () => {
      if (!user_id) return [];

      const response = await obtieneMercadoSucursales(user_id);
      if (response && response.data && Array.isArray(response.data.results)) {
        return response.data.results;
      }
      return [];
    },
    enabled: !!user_id, // Solo ejecutar si hay user_id
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  function handleAssignExternalId() {
    if (selectedSucursal && user_id && externalId.trim()) {
      // console.log("Valores capturados:");
      // console.log("userId:", user_id);
      // console.log("storeId:", selectedSucursal.id);
      // console.log("externalId:", externalId.trim());
      // console.log("selectedSucursal completo:", selectedSucursal);

      mutate({
        userId: user_id,
        storeId: selectedSucursal.id,
        externalId: externalId.trim(),
      });
    }
  }

  return (
    <div className="flex flex-col flex-1 gap-2 bg-[#23262F] border border-[#2d3344] shadow rounded-lg p-4">
      <h3 className="mb-2 text-base font-semibold text-blue-300 flex items-center gap-2">
        <MdStore className="text-xl text-blue-400" />
        Sucursales
      </h3>
      {isLoading ? (
        <div className="text-sm text-gray-400 flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          Cargando sucursales...
        </div>
      ) : error ? (
        <div className="text-sm text-red-400">Error al cargar las sucursales</div>
      ) : sucursales.length === 0 ? (
        <div className="italic text-sm text-gray-400">
          (Aquí se mostrarán las sucursales asociadas a tu cuenta)
        </div>
      ) : (
        <div className="flex flex-col gap-3 max-h-100 overflow-y-auto pr-1">
          {sucursales.map((suc: any) => {
            const fields = [
              { label: "ID", value: suc.id, color: "text-white", show: true },
              {
                label: "Dirección",
                value: suc.location?.address_line,
                color: "text-white",
                show: !!suc.location?.address_line,
              },
              {
                label: "Ciudad",
                value: suc.location?.city,
                color: "text-white",
                show: !!suc.location?.city,
              },
              {
                label: "Provincia",
                value: suc.location?.state_id,
                color: "text-white",
                show: !!suc.location?.state_id,
              },
              {
                label: "External ID",
                value: suc.external_id,
                color: "text-amber-500",
                labelColor: "text-amber-400",
                show: !!suc.external_id,
              },
            ];

            return (
              <div
                key={suc.id}
                className="bg-[#232a3a] border border-[#2d3344] rounded p-3 shadow-sm flex flex-col gap-2"
              >
                <div className="font-semibold text-blue-200 text-base mb-2">{suc.name}</div>

                {fields
                  .filter((field) => field.show)
                  .map((field, index) => (
                    <div key={index} className="flex text-sm mb-1">
                      <span
                        className={`w-20 text-right mr-3 ${field.labelColor || "text-gray-400"}`}
                      >
                        {field.label}:
                      </span>
                      <span className={`font-bold ${field.color}`}>{field.value}</span>
                    </div>
                  ))}

                {!suc.external_id && (
                  <button
                    className="mt-2 w-fit px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition"
                    onClick={() => {
                      setSelectedSucursal(suc);
                      setExternalId(suc.external_id || "");
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
          <h3 className="text-xl font-bold text-blue-300 mb-4">Asignar External ID</h3>

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
                  referencia única que permite identificar esta sucursal en tu sistema interno. Es
                  especialmente útil cuando trabajas con la API de Mercado Pago para:
                </p>
                <ul className="text-xs text-gray-300 leading-relaxed ml-4 space-y-1">
                  <li>
                    • <span className="text-blue-300">Identificar</span> a qué sucursal pertenecen
                    las órdenes creadas
                  </li>
                  <li>
                    • <span className="text-blue-300">Vincular</span> las transacciones con tu
                    sistema de gestión interno
                  </li>
                  <li>
                    • <span className="text-blue-300">Facilitar</span> la integración y
                    sincronización de datos
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
              <span className="w-22 text-right text-gray-400 mr-3">Sucursal:</span>
              <span className="font-bold text-white">{selectedSucursal?.name}</span>
            </div>
            <div className="flex text-sm mb-4">
              <span className="w-22 text-right text-gray-400 mr-3">ID:</span>
              <span className="font-bold text-blue-300">{selectedSucursal?.id}</span>
            </div>

            <label className="block text-sm text-gray-300 mb-2">External ID:</label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-[#232a3a] border border-[#2d3344] rounded text-white text-sm focus:outline-none focus:border-blue-500"
              placeholder="Ej: SUC001, MATRIZ, CENTRO, etc."
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
