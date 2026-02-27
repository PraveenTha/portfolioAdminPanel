import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
  console.error("❌ VITE_API_URL is missing in environment variables");
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Attach admin token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔥 Global error handler (optional but recommended)
api.interceptors.response.use(
  (res) => res,
  (error) => {
    console.error("API ERROR:", error.response?.status, error.message);
    return Promise.reject(error);
  },
);

export default api;
