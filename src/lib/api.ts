import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
  throw new Error("VITE_API_URL no está definido en el entorno (.env)");
}

const api = axios.create({
  baseURL,
});

export default api;
