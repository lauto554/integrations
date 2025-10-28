import { useMercadoStore } from "../store/mercadoStore";
import PosCard from "./cards/PosCard";
import SucursalesCard from "./cards/SucursalesCard";

export default function DashboardMercado() {
  const datosUserMp = useMercadoStore((s) => s.datosUserMp);

  return (
    <div className="flex w-full flex-col">
      {/* === DATOS DE CUENTA MERCADO PAGO === */}
      <div className="flex w-full gap-6 px-6 py-2 mb-2 bg-[#23262F] border border-[#2d3344] shadow">
        {/* Nombre y avatar a la izquierda */}
        <div className="flex items-center gap-4">
          <img
            src="/mercadopago.png"
            alt="Logo MP"
            className="flex h-14 w-14 items-center justify-center p-1 bg-white rounded-full"
          />
          <div>
            <h2 className="mb-1 text-2xl font-bold text-blue-400">
              {datosUserMp.data.first_name} {datosUserMp.data.last_name}
            </h2>
            <div className="text-xs text-gray-400">{datosUserMp.data.email}</div>
            <div className="text-xs text-gray-400">{datosUserMp.data.nickname}</div>
            <div className="text-xs text-gray-400">ID: {datosUserMp.data.id}</div>
          </div>
        </div>
        {/* Datos principales a la derecha */}
        <div className="flex gap-8 mt-3">
          <div className="flex flex-col gap-1">
            <div className="text-sm text-gray-300 flex">
              <span className="font-normal w-24 text-right">Empresa:</span>{" "}
              <span className="font-bold text-white ml-2">
                {datosUserMp.data.company?.brand_name}
              </span>
            </div>
            <div className="text-sm text-gray-300 flex">
              <span className="font-normal w-24 text-right">CUIT:</span>{" "}
              <span className="font-bold text-white ml-2">
                {datosUserMp.data.identification?.number}
              </span>
            </div>
            <div className="text-sm text-gray-300 flex">
              <span className="font-normal w-24 text-right">Dirección:</span>{" "}
              <span className="font-bold text-white ml-2">
                {datosUserMp.data.address?.address}, {datosUserMp.data.address?.city}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-sm text-gray-300 flex">
              <span className="font-normal w-24 text-right">País:</span>{" "}
              <span className="font-bold text-white ml-2">{datosUserMp.data.country_id}</span>
            </div>
            <div className="text-sm text-gray-300 flex">
              <span className="font-normal w-24 text-right">Registro:</span>{" "}
              <span className="font-bold text-white ml-2">
                {new Date(datosUserMp.data.registration_date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* === SECCIONES: SUCURSALES, CAJAS, ORDENES === */}
      <div className="flex w-full flex-col gap-4 px-4">
        {/* Sucursales */}
        <SucursalesCard />
        {/* Cajas */}
        <PosCard />
        {/* Ordenes de Pago */}
        <div className="flex flex-col flex-1 gap-2 bg-[#23262F] border border-[#2d3344] shadow rounded-lg p-4">
          <h3 className="mb-2 text-base font-semibold text-blue-300">Órdenes de Pago</h3>
          <button className="w-fit flex items-center justify-center rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-blue-700">
            Generar nueva orden de pago
          </button>
          <div className="italic text-sm text-gray-400">
            (Aquí se mostrarán las órdenes de pago generadas)
          </div>
        </div>
      </div>
    </div>
  );
}
