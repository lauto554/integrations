import { Dispatch, SetStateAction } from "react";

type IntegrarCardProps = {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
};

export default function IntegrarCard({ setModalOpen }: IntegrarCardProps) {
  return (
    <div className="bg-[#23262F] border border-[#2d3344] rounded-xl shadow p-6 flex flex-col items-center min-w-[320px] max-w-xs">
      <span className="flex items-center justify-center h-10 w-10 bg-white rounded-full">
        <img
          src="/mercadopago.png"
          alt="Mercado Pago logo"
          className="h-8 w-auto object-contain"
          draggable={false}
        />
      </span>
      <h2 className="text-lg font-bold text-blue-400 cursor-default mt-2">Mercado Pago</h2>
      <p className="text-center text-gray-300 text-sm mb-4 cursor-default">
        Integra Mercado Pago a tu sistema y comienza a operar con pagos online de forma segura y
        profesional.
      </p>
      <button
        className="px-5 py-2 rounded bg-blue-600 text-white font-semibold text-sm shadow hover:bg-blue-700 transition cursor-pointer"
        onClick={() => {
          setModalOpen(true);
        }}
      >
        Integrar Mercado Pago
      </button>
    </div>
  );
}
