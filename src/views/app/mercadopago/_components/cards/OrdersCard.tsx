import { useState } from "react";
import { MdPayment } from "react-icons/md";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useMercadoStore } from "../../store/mercadoStore";
import { useMutation } from "@tanstack/react-query";
import { createPointOrder } from "../../services";
import { showSwalDarkMode } from "../swalDark";
import Modal from "../../../_components/Modal";

export default function OrdersCard() {
  const terminales = useMercadoStore((s) => s.terminales);
  const cajas = useMercadoStore((s) => s.cajas);
  const sucursales = useMercadoStore((s) => s.sucursales);
  const [paymentMethod, setPaymentMethod] = useState<"QR" | "POINT" | "">("");
  const [showQRExplanation, setShowQRExplanation] = useState(false);
  const [showPointExplanation, setShowPointExplanation] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [printReceipt, setPrintReceipt] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedTerminalId, setSelectedTerminalId] = useState<string>("");

  // Mutation para crear orden POINT
  const { mutate: createOrder, isPending } = useMutation({
    mutationFn: ({
      deviceId,
      description,
      amount,
      print,
    }: {
      deviceId: string;
      description: string;
      amount: string;
      print: number;
    }) => createPointOrder(deviceId, description, amount, print),
    onSuccess: (data) => {
      console.log(data);
      showSwalDarkMode({
        title: "¡Orden creada!",
        text: "La orden ha sido enviada exitosamente a la terminal POINT",
        icon: "success",
      });
      setModalOpen(false);
      // Limpiar formulario
      setAmount("");
      setDescription("");
      setPrintReceipt("");
      setSelectedTerminalId("");
    },
    onError: (error) => {
      console.error("Error creando orden:", error);
      showSwalDarkMode({
        title: "Error",
        text: "Error al crear la orden. Inténtalo de nuevo.",
        icon: "error",
      });
    },
  });

  // Función helper para obtener información de caja y sucursal
  function getTerminalInfo(terminal: any) {
    const caja = cajas.find((c) => c.external_id === terminal.external_pos_id);
    const sucursal = sucursales.find((s) => s.external_id === terminal.external_store_id);

    return {
      cajaName: caja?.name || terminal.external_pos_id || "Caja no encontrada",
      sucursalName: sucursal?.name || terminal.external_store_id || "Sucursal no encontrada",
    };
  }

  function isFormValid() {
    const hasValidAmount = amount.trim() !== "" && parseFloat(amount) >= 15;

    if (paymentMethod === "QR") {
      return hasValidAmount; // Para QR solo necesita monto >= 15
    } else if (paymentMethod === "POINT") {
      return hasValidAmount && printReceipt !== "" && selectedTerminalId !== ""; // Para POINT necesita monto >= 15, opción de impresión y terminal seleccionada
    }

    return false;
  }

  function handleCreateOrder() {
    if (paymentMethod === "POINT") {
      createOrder({
        deviceId: selectedTerminalId,
        description: description,
        amount: amount,
        print: parseInt(printReceipt),
      });
    } else {
      // QR - por ahora solo mostrar en consola
      console.log({
        deviceId: "N/A (QR no requiere terminal)",
        amount: parseFloat(amount),
        descripcion: description,
        print: "N/A (solo para POINT)",
      });
      setModalOpen(false);
    }
  }

  return (
    <div className="flex flex-col flex-1 gap-2 bg-[#23262F] border border-[#2d3344] shadow rounded-lg p-4">
      <h3 className="text-lg font-bold text-blue-300 flex items-center gap-2">
        <MdPayment className="text-2xl text-gray-200" />
        Crear Órdenes de Pago
      </h3>

      {/* Requisito previo */}
      <div className="bg-[#1a1e2a] border border-amber-600 rounded-lg p-3 mb-4">
        <h4 className="text-amber-400 font-semibold text-sm mb-2 flex items-center gap-2">
          ⚠️ Requisito importante
        </h4>
        <p className="text-xs text-gray-300 leading-relaxed">
          Para operar y crear órdenes, es necesario que tanto la{" "}
          <span className="font-semibold text-blue-300">caja</span> como la{" "}
          <span className="font-semibold text-blue-300">sucursal</span> tengan sus{" "}
          <span className="font-semibold text-amber-300">External ID</span> asignados. Asegúrate de
          configurarlos en las secciones anteriores antes de proceder.
        </p>
      </div>

      {/* Selección de método de pago */}
      <div className="mb-4">
        <h4 className="text-white font-semibold text-sm mb-3">Selecciona el método de pago:</h4>

        <div className="flex gap-4">
          {/* Opción QR */}
          <div className="flex-1 bg-[#232a3a] border border-[#2d3344] rounded-lg p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="QR"
                checked={paymentMethod === "QR"}
                onChange={(e) => setPaymentMethod(e.target.value as "QR")}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-600 focus:ring-blue-500 bg-gray-700"
              />
              <div className="flex-1">
                <div className="text-white font-semibold text-sm mb-1">QR Code</div>
                <p className="text-xs text-gray-400 mb-2">
                  Genera códigos QR para que los clientes puedan pagar escaneándolos con sus
                  dispositivos móviles.
                </p>

                <button
                  className="w-full flex items-center justify-between text-left hover:bg-[#0f1419] p-2 rounded transition"
                  onClick={() => setShowQRExplanation(!showQRExplanation)}
                >
                  <span className="text-xs text-blue-300">Tipos de QR disponibles</span>
                  {showQRExplanation ? (
                    <FaChevronUp className="text-xs text-gray-400" />
                  ) : (
                    <FaChevronDown className="text-xs text-gray-400" />
                  )}
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    showQRExplanation ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="mt-2 px-2 space-y-2">
                    <div className="bg-[#1a1e2a] p-2 rounded">
                      <span className="text-xs font-semibold text-purple-400">QR Estático:</span>
                      <p className="text-xs text-gray-300 mt-1">
                        QR fijo asociado a la caja. El cliente ingresa el monto desde su app de MP.
                      </p>
                    </div>
                    <div className="bg-[#1a1e2a] p-2 rounded">
                      <span className="text-xs font-semibold text-green-400">QR Dinámico:</span>
                      <p className="text-xs text-gray-300 mt-1">
                        Se genera un QR único para cada transacción con monto específico. Mayor
                        seguridad y control.
                      </p>
                    </div>
                    <div className="bg-[#1a1e2a] p-2 rounded">
                      <span className="text-xs font-semibold text-blue-400">QR Híbrido:</span>
                      <p className="text-xs text-gray-300 mt-1">
                        Asigna el monto al QR estático y genera uno dinámico. Combina la comodidad
                        del estático con la seguridad del dinámico.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </label>
          </div>

          {/* Opción POINT */}
          <div className="flex-1 bg-[#232a3a] border border-[#2d3344] rounded-lg p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="POINT"
                checked={paymentMethod === "POINT"}
                onChange={(e) => setPaymentMethod(e.target.value as "POINT")}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-600 focus:ring-blue-500 bg-gray-700"
              />
              <div className="flex-1">
                <div className="text-white font-semibold text-sm mb-1">POINT (Terminal física)</div>
                <p className="text-xs text-gray-400 mb-2">
                  Procesa pagos directamente en la terminal POINT de Mercado Pago conectada a tu
                  sistema.
                </p>

                <button
                  className="w-full flex items-center justify-between text-left hover:bg-[#0f1419] p-2 rounded transition"
                  onClick={() => setShowPointExplanation(!showPointExplanation)}
                >
                  <span className="text-xs text-blue-300">Requisitos para POINT</span>
                  {showPointExplanation ? (
                    <FaChevronUp className="text-xs text-gray-400" />
                  ) : (
                    <FaChevronDown className="text-xs text-gray-400" />
                  )}
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    showPointExplanation ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="mt-2 px-2">
                    <div className="bg-[#1a1e2a] border border-amber-600 p-2 rounded">
                      <span className="text-xs font-semibold text-amber-400">
                        ⚠️ Requisito obligatorio:
                      </span>
                      <p className="text-xs text-gray-300 mt-1">
                        La terminal debe estar configurada en modo{" "}
                        <span className="font-semibold text-green-400">PDV</span> para poder recibir
                        órdenes de pago desde tu sistema de manera automática.
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Si está en modo STANDALONE, solo funcionará manualmente desde la terminal.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>

      {paymentMethod && (
        <div className="bg-[#1a1e2a] border border-blue-600 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-blue-300">
              ✓ Método seleccionado:{" "}
              <span className="font-semibold text-white">{paymentMethod}</span>
            </p>
            <button
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition flex items-center gap-2"
              onClick={() => {
                // Limpiar el formulario al abrir el modal
                setAmount("");
                setDescription("");
                setPrintReceipt("");
                setSelectedTerminalId("");
                setModalOpen(true);
              }}
            >
              Crear Orden
            </button>
          </div>
        </div>
      )}

      {/* Modal para crear orden */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="w-150 flex flex-col">
          <h3 className="text-xl font-bold text-blue-300 mb-4">Crear Orden - {paymentMethod}</h3>

          <div className="bg-[#1a1e2a] border border-[#2d3344] rounded-lg p-4 mb-4">
            <h4 className="text-blue-200 font-semibold text-sm mb-3">Configuración de la orden</h4>

            {paymentMethod === "QR" ? (
              <div className="space-y-3">
                <p className="text-xs text-gray-300">
                  Estás creando una orden de pago con{" "}
                  <span className="font-semibold text-blue-300">código QR</span>. El sistema
                  generará un QR que el cliente puede escanear para realizar el pago.
                </p>
                <div className="bg-[#232a3a] border border-blue-500 rounded p-3">
                  <h5 className="text-xs font-semibold text-blue-400 mb-2">Opciones de QR:</h5>
                  <ul className="text-xs text-gray-300 space-y-1">
                    <li>• QR Dinámico: Monto fijo, mayor seguridad</li>
                    <li>• QR Híbrido: Combina estático con dinámico</li>
                    <li>• QR Estático: Cliente ingresa monto</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-gray-300">
                  Estás creando una orden de pago para{" "}
                  <span className="font-semibold text-green-400">terminal POINT</span>. La orden se
                  enviará directamente a la terminal para su procesamiento.
                </p>
                {/* <div className="bg-[#232a3a] border border-green-500 rounded p-3">
                  <h5 className="text-xs font-semibold text-green-400 mb-2">
                    Requisitos verificados:
                  </h5>
                  <ul className="text-xs text-gray-300 space-y-1">
                    <li>✓ Terminal en modo PDV</li>
                    <li>✓ Conexión API activa</li>
                    <li>✓ External ID configurado</li>
                  </ul>
                </div> */}
              </div>
            )}
          </div>

          {/* Selector de terminal para POINT */}
          {paymentMethod === "POINT" && (
            <div className="mb-4">
              <label className="block text-sm text-gray-300 mb-2">Seleccionar terminal:</label>
              <select
                className="w-full px-3 py-2 bg-[#232a3a] border border-[#2d3344] rounded text-white text-sm focus:outline-none focus:border-blue-500"
                value={selectedTerminalId}
                onChange={(e) => setSelectedTerminalId(e.target.value)}
              >
                <option value="">Seleccione una terminal...</option>
                {terminales.map((terminal: any) => {
                  const { cajaName, sucursalName } = getTerminalInfo(terminal);
                  return (
                    <option key={terminal.id} value={terminal.id}>
                      Terminal: {terminal.name || terminal.id} (
                      {terminal.operating_mode || "Sin modo"}) → Caja: {cajaName} → Sucursal:{" "}
                      {sucursalName}
                    </option>
                  );
                })}
              </select>
              {terminales.length === 0 && (
                <p className="text-amber-400 text-xs mt-1">
                  ⚠️ No hay terminales disponibles. Primero configure las terminales en la sección
                  "Dispositivos".
                </p>
              )}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-2">Monto de la orden:</label>
            <input
              type="number"
              className={`w-full px-3 py-2 bg-[#232a3a] border rounded text-white text-sm focus:outline-none ${
                amount && parseFloat(amount) < 15
                  ? "border-red-500 focus:border-red-500"
                  : "border-[#2d3344] focus:border-blue-500"
              }`}
              placeholder="Monto mínimo: $15.00"
              step="0.01"
              min="15"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            {amount && parseFloat(amount) < 15 && (
              <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                El monto mínimo permitido es $15.00
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-2">Descripción (opcional):</label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-[#232a3a] border border-[#2d3344] rounded text-white text-sm focus:outline-none focus:border-blue-500"
              placeholder="Descripción del producto o servicio"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {paymentMethod === "POINT" && (
            <div className="mb-4">
              <label className="block text-sm text-gray-300 mb-3">Imprimir recibo:</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="printReceipt"
                    value="1"
                    checked={printReceipt === "1"}
                    onChange={(e) => setPrintReceipt(e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-600 focus:ring-blue-500 bg-gray-700"
                  />
                  <span className="text-sm text-white">Sí</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="printReceipt"
                    value="0"
                    checked={printReceipt === "0"}
                    onChange={(e) => setPrintReceipt(e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-600 focus:ring-blue-500 bg-gray-700"
                  />
                  <span className="text-sm text-white">No</span>
                </label>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded font-semibold transition"
              onClick={handleCreateOrder}
              disabled={!isFormValid() || isPending}
            >
              {isPending ? "Creando..." : "Crear Orden"}
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
