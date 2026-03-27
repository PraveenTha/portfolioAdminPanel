import axios from "axios";

/* ===========================
   BASE URL
=========================== */

const BASE_URL = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
  console.error("❌ VITE_API_URL missing — check .env or Vercel env");
}

console.log("✅ API BASE URL:", BASE_URL);

/* ===========================
   AXIOS INSTANCE
=========================== */

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
});

/* ===========================
   REQUEST INTERCEPTOR
=========================== */

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");

    // ✅ Token attach
    if (
      token &&
      !config.url.includes("/auth/login") &&
      !config.url.includes("/auth/register")
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ IMPORTANT: multipart fix (image upload ke liye)
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
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

    // 🔐 Unauthorized
    if (error.response?.status === 401) {
      console.warn("⚠️ Unauthorized — redirecting");
      localStorage.removeItem("adminToken");
      window.location.href = "/";
    }

    // ❌ 404 Debug
    if (error.response?.status === 404) {
      console.error("❌ 404 ERROR");
      console.error(
        "👉 FULL URL:",
        error.config?.baseURL + error.config?.url
      );
    }

    // 🌐 Network Issue
    if (!error.response) {
      console.error("🌐 Backend down or Render sleeping");
    }

    console.error("API ERROR:", error.response?.status, error.message);

    return Promise.reject(error);
  }
);

export default api;
