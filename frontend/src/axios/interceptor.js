import axios from "axios";

const instancia = axios.create({
  baseURL: import.meta.env.VITE_URL_BACKEND,
});

instancia.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

instancia.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status == 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  },
);

export default instancia;
