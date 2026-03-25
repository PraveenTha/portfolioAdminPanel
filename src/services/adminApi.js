import axios from "axios";

/* ===========================
   BASE URL SAFETY CHECK
=========================== */

const BASE_URL = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
  console.error("❌ VITE_API_URL is not defined in environment variables");
}

/* ===========================
   AXIOS INSTANCE
=========================== */

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // ✅ prevent hanging requests
});

/* ===========================
   REQUEST INTERCEPTOR (TOKEN)
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
  (error) => Promise.reject(error)
);

/* ===========================
   RESPONSE INTERCEPTOR
=========================== */

api.interceptors.response.use(
  (response) => response,
  (error) => {

    /* ===== 401 UNAUTHORIZED ===== */
    if (error.response?.status === 401) {
      console.warn("⚠️ Unauthorized – redirecting to login");
      localStorage.removeItem("adminToken");
      window.location.href = "/";
    }

    /* ===== 404 ERROR (IMPORTANT FIX) ===== */
    if (error.response?.status === 404) {
      console.error("❌ API 404 ERROR → Check endpoint or BASE_URL");
      console.error("👉 URL:", error.config?.baseURL + error.config?.url);
    }

    /* ===== NETWORK ERROR ===== */
    if (!error.response) {
      console.error("🌐 Network Error – Backend may be down (Render sleep)");
    }

    console.error("API Error:", error.response?.status, error.message);

    return Promise.reject(error);
  }
);

export default api;
