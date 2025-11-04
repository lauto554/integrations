import { useMercadoStore } from "../../store/mercadoStore";
import { MdStore, MdPointOfSale } from "react-icons/md";
import { FaCashRegister } from "react-icons/fa";

export default function InicioCard() {
  const sucursales = useMercadoStore((s) => s.sucursales);
  const cajas = useMercadoStore((s) => s.cajas);
  const terminales = useMercadoStore((s) => s.terminales);

  const cards = [
    {
      label: "Sucursales",
      icon: MdStore,
      cardClass: "bg-gradient-to-br from-blue-900/80 to-blue-700/60 border-blue-900",
      valueClass: "text-blue-100",
      labelClass: "text-blue-200",
      iconClass: "text-blue-300",
      getValue: (sucursales: any[], cajas: any[], terminales: any[]) => sucursales.length,
    },
    {
      label: "Cajas",
      icon: FaCashRegister,
      cardClass: "bg-gradient-to-br from-amber-900/80 to-yellow-700/60 border-yellow-900",
      valueClass: "text-amber-100",
      labelClass: "text-amber-200",
      iconClass: "text-amber-300",
      getValue: (sucursales: any[], cajas: any[], terminales: any[]) => cajas.length,
    },
    {
      label: "Terminales",
      icon: MdPointOfSale,
      cardClass: "bg-gradient-to-br from-green-900/80 to-green-700/60 border-green-900",
      valueClass: "text-green-100",
      labelClass: "text-green-200",
      iconClass: "text-green-300",
      getValue: (sucursales: any[], cajas: any[], terminales: any[]) => terminales.length,
    },
  ];

  return (
    <div className="w-full flex flex-col items-center justify-center py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-3xl">
        {cards.map((item) => {
          const value = item.getValue(sucursales, cajas, terminales);
          return (
            <div
              key={item.label}
              className={`flex flex-col items-center border rounded-2xl shadow-lg p-6 transition hover:scale-105 ${item.cardClass}`}
            >
              {<item.icon className={`text-5xl mb-2 drop-shadow ${item.iconClass}`} />}
              <span className={`text-4xl font-extrabold drop-shadow ${item.valueClass}`}>
                {value}
              </span>
              <span className={`text-lg mt-1 font-semibold ${item.labelClass}`}>{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
