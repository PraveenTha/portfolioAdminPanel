import axios from "axios";

/* ===========================
   BASE URL SAFETY CHECK
=========================== */

const BASE_URL = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
  console.error("❌ VITE_API_URL is not defined in environment variables");
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ===========================
   AUTH TOKEN INTERCEPTOR
=========================== */

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");

    if (
      token &&
      !config.url.includes("/auth/login") &&
      !config.url.includes("/auth/register")
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/* ===========================
   RESPONSE ERROR HANDLING
=========================== */

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("⚠️ Unauthorized – redirecting to login");
      localStorage.removeItem("adminToken");
      window.location.href = "/";
    }

    console.error("API Error:", error.response?.status, error.message);
    return Promise.reject(error);
  },
);

export default api;
