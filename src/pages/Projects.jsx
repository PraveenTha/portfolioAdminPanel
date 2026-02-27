import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import api from "../services/adminApi";
import "../assets/css/projects.css";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);

  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(null);
  const [image, setImage] = useState(null);

  const initialForm = {
    title: "",
    shortDescription: "",
    description: "",
    category: "",
    tags: "",
    projectLink: "",
    isActive: true,
  };

  const [form, setForm] = useState(initialForm);

  /* ================= FETCH ================= */
  const fetchProjects = async () => {
    try {
      const res = await api.get("/admin/projects");
      setProjects(res.data);
    } catch (err) {
      console.error("Fetch projects error:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/admin/project-categories");
      setCategories(res.data.filter((c) => c.isActive));
    } catch (err) {
      console.error("Fetch categories error:", err);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchCategories();
  }, []);

  /* ================= SUBMIT ================= */
  const submit = async (e) => {
    e.preventDefault();

    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("shortDescription", form.shortDescription);
      fd.append("description", form.description);
      fd.append("category", form.category);
      fd.append("projectLink", form.projectLink);
      fd.append("isActive", form.isActive);

      fd.append(
        "tags",
        JSON.stringify(
          form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        )
      );

      if (image) {
        fd.append("projectImage", image);
      }

      // ✅ IMPORTANT: NO HEADERS HERE
      if (edit) {
        await api.put(`/admin/projects/${edit._id}`, fd);
      } else {
        await api.post("/admin/projects", fd);
      }

      closeModal();
      fetchProjects();

    } catch (err) {
      console.error("Project save error:", err);
      alert("Upload failed ❌");
    }
  };

  /* ================= DELETE ================= */
  const remove = async (id) => {
    if (window.confirm("Delete this project?")) {
      try {
        await api.delete(`/admin/projects/${id}`);
        fetchProjects();
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  /* ================= MODAL ================= */
  const openAdd = () => {
    setEdit(null);
    setForm(initialForm);
    setImage(null);
    setShow(true);
  };

  const openEdit = (p) => {
    setEdit(p);
    setForm({
      title: p.title,
      shortDescription: p.shortDescription,
      description: p.description,
      category: p.category?._id || "",
      tags: p.tags?.join(",") || "",
      projectLink: p.projectLink || "",
      isActive: p.isActive,
    });
    setImage(null);
    setShow(true);
  };

  const closeModal = () => {
    setShow(false);
    setEdit(null);
    setForm(initialForm);
    setImage(null);
  };

  return (
    <AdminLayout>
      <div className="glass-card p-4">
        <div className="d-flex justify-content-between mb-3">
          <h4 className="color-white">Projects</h4>
          <button className="btn btn-primary" onClick={openAdd}>
            + Add Project
          </button>
        </div>

        <div className="grid">
          {projects.map((p) => (
            <div className="m-3" key={p._id}>
              <div className="card project-card h-100">
                {p.image && (
                  <img
                    src={p.image}
                    alt={p.title}
                    className="project-thumb"
                  />
                )}

                <div className="p-3">
                  <h6>{p.title}</h6>
                  <p className="small">{p.shortDescription}</p>

                  {p.category && (
                    <span className="badge bg-info me-1">
                      {p.category.name}
                    </span>
                  )}

                  <div className="mt-2">
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => openEdit(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => remove(p._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {show && (
          <div className="modal-backdrop skill-modal">
            <div className="modal-box large">
              <div className="d-flex justify-content-between mb-3">
                <h5>{edit ? "Edit Project" : "Add Project"}</h5>
                <button className="close-btn" onClick={closeModal}>
                  ×
                </button>
              </div>

              <form onSubmit={submit}>
                <input
                  className="form-control mb-2"
                  placeholder="Project Title"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  required
                />

                <input
                  className="form-control mb-2"
                  placeholder="Short Description"
                  value={form.shortDescription}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      shortDescription: e.target.value,
                    })
                  }
                  required
                />

                <textarea
                  className="form-control mb-2"
                  rows="3"
                  placeholder="Full Description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  required
                />

                <select
                  className="form-control mb-2"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option value={c._id} key={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <input
                  className="form-control mb-2"
                  placeholder="Tags (html, css, react)"
                  value={form.tags}
                  onChange={(e) =>
                    setForm({ ...form, tags: e.target.value })
                  }
                />

                <input
                  className="form-control mb-2"
                  placeholder="Project Link"
                  value={form.projectLink}
                  onChange={(e) =>
                    setForm({ ...form, projectLink: e.target.value })
                  }
                />

                <input
                  type="file"
                  className="form-control mb-2"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />

                <label className="mt-2 d-block">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        isActive: e.target.checked,
                      })
                    }
                  />{" "}
                  Show Project
                </label>

                <button className="btn btn-success w-100 mt-3">
                  Save Project
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Projects;