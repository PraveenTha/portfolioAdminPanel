import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/adminApi.js";

// 🔥 CSS IMPORT
import "../assets/css/style.css";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", form);

      // ✅ token save
      localStorage.setItem("adminToken", res.data.token);

      // ✅ redirect
      navigate("/dashboard");
    } catch (err) {
      // ❌ error handle
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginPage">
      <div className="card p-4 shadow" style={{ width: "360px" }}>
        <h3 className="text-center mb-3">Admin Login</h3>

        {/* ❌ Error Message */}
        {error && (
          <div className="alert alert-danger py-2 text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
