import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./views/Layout";
import MercadoPagoView from "./views/app/mercadopago/MercadoPagoView";
import HomeView from "./views/app/home/HomeView";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomeView />} />
          <Route path="mercado-pago" element={<MercadoPagoView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
