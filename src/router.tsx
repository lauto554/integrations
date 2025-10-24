import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./views/Layout";
import MercadoPagoView from "./views/app/mercadopago/MercadoPagoView";
import HomeView from "./views/app/home/HomeView";
import PortalView from "./views/auth/PortalView";
import ProtectedRoute from "./views/_components/ProtectedRoute";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PortalView />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<HomeView />} />
            <Route path="mercado-pago" element={<MercadoPagoView />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
