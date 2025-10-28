import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
  throw new Error("VITE_API_URL no está definido en el entorno (.env)");
}

const api = axios.create({
  baseURL,
});

// Interceptor para agregar access_token de la cookie a cada request
api.interceptors.request.use(
  (config) => {
    const accessToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token="))
      ?.split("=")[1];
    if (accessToken) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar 401 y refrescar el token
let isRefreshing = false;
let failedQueue: any[] = [];

function processQueue(error: any, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Obtener refresh token de la cookie
        const refreshToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("refresh_token="))
          ?.split("=")[1];
        if (!refreshToken) throw new Error("No refresh token");
        const res = await axios.post(
          baseURL + "/auth/refresh-token",
          {},
          {
            headers: { Authorization: `Bearer ${refreshToken}` },
            withCredentials: true,
          }
        );
        const newAccessToken = res.data?.data?.access_token;
        if (newAccessToken) {
          // Guardar el nuevo access_token en la cookie
          document.cookie = `access_token=${newAccessToken}; path=/;`;
          api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
          processQueue(null, newAccessToken);
          return api({
            ...originalRequest,
            headers: { ...originalRequest.headers, Authorization: `Bearer ${newAccessToken}` },
          });
        } else {
          processQueue(new Error("No access token in refresh response"), null);
          return Promise.reject(error);
        }
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
