import { createBrowserRouter } from "react-router-dom";
import Layout from "./views/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    // Puedes agregar más rutas hijas aquí
  },
]);
