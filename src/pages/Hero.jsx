import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import api from "../services/adminApi";

const Hero = () => {
  const [form, setForm] = useState({
    heading: "",
    subheading: "",
    rotatingTexts: "",
  });

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch existing hero
  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await api.get("/admin/hero");

        if (res.data) {
          setForm({
            heading: res.data.heading || "",
            subheading: res.data.subheading || "",
            rotatingTexts: Array.isArray(res.data.rotatingTexts)
              ? res.data.rotatingTexts.join("\n")
              : "",
          });
        }
      } catch (err) {
        console.error("Hero fetch failed");
      }
    };

    fetchHero();
  }, []);

  // 🔹 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    // ✅ Prepare payload (OPTIONAL SAFE)
    const payload = {
      heading: form.heading.trim(),
      subheading: form.subheading.trim(),
      rotatingTexts: form.rotatingTexts
        .split("\n")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      await api.put("/admin/hero", payload);
      setMsg("Hero updated successfully ✅");
    } catch (err) {
      console.error(err);
      setMsg("Error updating hero ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="glass-card p-4">
        <h4 className="section-title">Hero Section</h4>
        <p className="section-sub">
          Homepage hero heading, subtitle & rotating text
        </p>

        {msg && (
          <div
            className={`alert mt-3 ${
              msg.includes("success") ? "alert-success" : "alert-danger"
            }`}
          >
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4">
          {/* 🔹 Heading */}
          <input
            className="form-control mb-3"
            placeholder="Main Heading (required)"
            value={form.heading}
            onChange={(e) => setForm({ ...form, heading: e.target.value })}
            required
          />

          {/* 🔹 Static Subtitle (OPTIONAL) */}
          <input
            className="form-control mb-3"
            placeholder="Static Subtitle (optional)"
            value={form.subheading}
            onChange={(e) => setForm({ ...form, subheading: e.target.value })}
          />

          {/* 🔹 Rotating Texts (OPTIONAL) */}
          <textarea
            className="form-control mb-4"
            rows="5"
            placeholder={`Rotating Texts (optional)\nOne line per text\nExample:\nFurther\nOut of Limits\nNext Level`}
            value={form.rotatingTexts}
            onChange={(e) =>
              setForm({ ...form, rotatingTexts: e.target.value })
            }
          />

          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Saving..." : "Save Hero Section"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default Hero;
