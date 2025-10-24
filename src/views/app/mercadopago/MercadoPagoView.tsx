import { useState, useEffect } from "react";
import Modal from "../_components/Modal";
import MercadoPagoForm from "./_components/MercadoPagoForm";

export default function MercadoPagoView() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<string | null>(null);

  // Restore modal state from localStorage on mount
  useEffect(() => {
    const storedOpen = localStorage.getItem("mp_modalOpen");
    const storedAction = localStorage.getItem("mp_modalAction");
    if (storedOpen === "true") setModalOpen(true);
    if (storedAction) setModalAction(storedAction);
  }, []);

  // Persist modal state to localStorsage
  useEffect(() => {
    localStorage.setItem("mp_modalOpen", modalOpen ? "true" : "false");
  }, [modalOpen]);

  useEffect(() => {
    if (modalAction) {
      localStorage.setItem("mp_modalAction", modalAction);
    } else {
      localStorage.removeItem("mp_modalAction");
    }
  }, [modalAction]);

  const cards = [
    {
      key: "integrar",
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
      title: "Mercado Pago",
      description:
        "Integra Mercado Pago a tu sistema y comienza a operar con pagos online de forma segura y profesional.",
      button: "Integrar Mercado Pago",
    },
    {
      key: "pruebas",
      icon: null,
      title: "¿Ya iniciaste la integración?",
      description:
        "Comenzá a hacer las pruebas de integración y validá el funcionamiento de tu conexión con Mercado Pago.",
      button: "Comenzar pruebas",
    },
  ];

  return (
    <div className="flex flex-col h-full w-full p-8">
      <div className="w-full flex flex-col items-start gap-6 mb-8">
        {cards.map((card) => (
          <div
            key={card.key}
            className="bg-[#23262F] border border-[#2d3344] rounded-xl shadow p-6 flex flex-col items-center min-w-[320px] max-w-xs transition-all duration-200 hover:shadow-xl hover:scale-[1.025]"
          >
            {card.icon && (
              <div className="flex items-center gap-3 mb-2">
                {card.icon}
                <h2 className="text-lg font-bold text-blue-400 cursor-default">{card.title}</h2>
              </div>
            )}
            {!card.icon && (
              <h2 className="text-lg font-bold text-blue-400 mb-2 cursor-default">{card.title}</h2>
            )}
            <p className="text-center text-gray-300 text-sm mb-4 cursor-default">
              {card.description}
            </p>
            <button
              className="px-5 py-2 rounded bg-blue-600 text-white font-semibold text-sm shadow hover:bg-blue-700 transition cursor-pointer"
              onClick={() => {
                setModalAction(card.key);
                setModalOpen(true);
              }}
            >
              {card.button}
            </button>
          </div>
        ))}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setModalAction(null);
        }}
      >
        <div className=""></div>
        {/* <MercadoPagoForm action={modalAction} /> */}
      </Modal>
    </div>
  );
}
