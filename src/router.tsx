import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./views/Layout";
// import MercadoPagoView from "./views/app/mercadopago/MercadoPagoView";
import HomeView from "./views/app/home/HomeView";
import PortalView from "./views/auth/PortalView";
import ProtectedRoute from "./views/_components/ProtectedRoute";
import MercadoPagoLayout from "./views/app/mercadopago/MercadoPagoLayout";
import SucursalesCard from "./views/app/mercadopago/_components/cards/SucursalesCard";
import PosCard from "./views/app/mercadopago/_components/cards/PosCard";
import DevicesCard from "./views/app/mercadopago/_components/cards/DevicesCard";
import InicioCard from "./views/app/mercadopago/_components/cards/InicioCard";
import OrdersCard from "./views/app/mercadopago/_components/cards/OrdersCard";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PortalView />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<HomeView />} />
            <Route path="mercado-pago" element={<MercadoPagoLayout />}>
              <Route path="inicio" element={<InicioCard />} />
              <Route path="stores" element={<SucursalesCard />} />
              <Route path="pos" element={<PosCard />} />
              <Route path="devices" element={<DevicesCard />} />
              <Route path="orders" element={<OrdersCard />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
