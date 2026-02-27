import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import api from "../services/adminApi";

const About = () => {
  const [form, setForm] = useState({
    title: "",
    rotatingSubtitles: "",
    description: "",
    resumeLink: "", // ✅ Google Drive link
  });

  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await api.get("/admin/about");
        if (!res.data) return;

        setForm({
          title: res.data.title || "",
          rotatingSubtitles:
            res.data.rotatingSubtitles?.join("\n") || "",
          description: res.data.description || "",
          resumeLink: res.data.resumeFile || "", // ✅ saved link
        });

        setCurrentImage(res.data.image || "");
      } catch (err) {
        console.error("Fetch about failed:", err);
      }
    };

    fetchAbout();
  }, []);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const fd = new FormData();

      fd.append("title", form.title);

      fd.append(
        "rotatingSubtitles",
        JSON.stringify(
          form.rotatingSubtitles
            .split("\n")
            .map((t) => t.trim())
            .filter(Boolean)
        )
      );

      fd.append("description", form.description);

      // ✅ Google Drive link save
      fd.append("resumeFile", form.resumeLink);

      if (image) {
        fd.append("image", image);
      }

      if (!currentImage && !image) {
        fd.append("removeImage", "true");
      }

      const res = await api.put("/admin/about", fd);

      setCurrentImage(res.data.image || "");

      setMsg("About section updated successfully ✅");
    } catch (err) {
      console.error("Update about failed:", err);
      setMsg("Error updating About ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="glass-card p-4">
        <h4 className="section-title color-white">About Section</h4>

        {msg && <div className="alert alert-info mt-3">{msg}</div>}

        <form onSubmit={handleSubmit} className="mt-4">

          {/* TITLE */}
          <input
            className="form-control mb-3"
            placeholder="Title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          {/* SUBTITLES */}
          <textarea
            className="form-control mb-3"
            rows="4"
            placeholder="Rotating subtitles (one per line)"
            value={form.rotatingSubtitles}
            onChange={(e) =>
              setForm({
                ...form,
                rotatingSubtitles: e.target.value,
              })
            }
          />

          {/* DESCRIPTION */}
          <textarea
            className="form-control mb-3"
            rows="6"
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          {/* ✅ GOOGLE DRIVE RESUME LINK */}
          <label className="d-block mb-2 text-light">
            Resume Link (Google Drive)
          </label>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Paste Google Drive public link here"
            value={form.resumeLink}
            onChange={(e) =>
              setForm({ ...form, resumeLink: e.target.value })
            }
          />

          {/* IMAGE */}
          <label className="d-block mb-2 text-light">
            Upload Image
          </label>
          <input
            type="file"
            className="form-control mb-3"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />

          {currentImage && (
            <div className="text-center mb-3">
              <img
                src={currentImage}
                alt="About"
                style={{
                  maxWidth: "150px",
                  borderRadius: "10px",
                }}
              />
            </div>
          )}

          <button
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save About Section"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default About;