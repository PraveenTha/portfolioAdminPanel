import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import api from "../services/adminApi";

const Experience = () => {
  const [list, setList] = useState([]);
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(null);
  const [logo, setLogo] = useState(null);

  const initialForm = {
    role: "",
    company: "",
    duration: "",
    description: "",
    isActive: true,
  };

  const [form, setForm] = useState(initialForm);

  /* ================= FETCH ================= */
  const fetchData = async () => {
    try {
      const res = await api.get("/admin/experience");
      setList(res.data);
    } catch (err) {
      console.error("Experience fetch error", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= SUBMIT ================= */
  const submit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));

    if (logo) fd.append("logo", logo);

    try {
      if (edit) {
        await api.put(`/admin/experience/${edit._id}`, fd);
      } else {
        await api.post("/admin/experience", fd);
      }

      closeModal();
      fetchData();
    } catch (err) {
      console.error("Save error", err);
    }
  };

  /* ================= DELETE ================= */
  const remove = async (id) => {
    if (window.confirm("Delete experience?")) {
      await api.delete(`/admin/experience/${id}`);
      fetchData();
    }
  };

  /* ================= MODAL CONTROLS ================= */
  const openAdd = () => {
    setEdit(null);
    setForm(initialForm);
    setLogo(null);
    setShow(true);
  };

  const openEdit = (item) => {
    setEdit(item);
    setForm({
      role: item.role,
      company: item.company,
      duration: item.duration,
      description: item.description,
      isActive: item.isActive,
    });
    setLogo(null);
    setShow(true);
  };

  const closeModal = () => {
    setShow(false);
    setEdit(null);
    setLogo(null);
    setForm(initialForm);
  };

  return (
    <AdminLayout>
      <div className="glass-card p-4">
        <div className="d-flex justify-content-between mb-3">
          <h4 className="color-white">Experience</h4>
          <button className="btn btn-primary" onClick={openAdd}>
            + Add Experience
          </button>
        </div>

        <div className="row">
          {list.map((e) => (
            <div className="col-md-4 mb-3" key={e._id}>
              <div className="card p-3 h-100">

                {/* ✅ FIXED IMAGE */}
                {e.logo && (
                  <img
                    src={e.logo}   // Cloudinary direct URL
                    alt="logo"
                    style={{ width: 40, marginBottom: 10 }}
                  />
                )}

                <h6>{e.role}</h6>
                <p className="mb-1">{e.company}</p>
                <small className="text-muted">{e.duration}</small>

                <p className="mt-2">
                  Status: <strong>{e.isActive ? "Show" : "Hide"}</strong>
                </p>

                <div className="mt-auto">
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => openEdit(e)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => remove(e._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* MODAL */}
        {show && (
          <div className="modal-backdrop skill-modal">
            <div className="modal-box">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>{edit ? "Edit Experience" : "Add Experience"}</h5>
                <button className="close-btn" onClick={closeModal}>
                  ×
                </button>
              </div>

              <form onSubmit={submit}>
                <input
                  className="form-control mb-2"
                  placeholder="Role"
                  value={form.role}
                  onChange={(e) =>
                    setForm({ ...form, role: e.target.value })
                  }
                  required
                />

                <input
                  className="form-control mb-2"
                  placeholder="Company"
                  value={form.company}
                  onChange={(e) =>
                    setForm({ ...form, company: e.target.value })
                  }
                  required
                />

                <input
                  className="form-control mb-2"
                  placeholder="Duration"
                  value={form.duration}
                  onChange={(e) =>
                    setForm({ ...form, duration: e.target.value })
                  }
                  required
                />

                <textarea
                  className="form-control mb-2"
                  placeholder="Description"
                  rows="3"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  required
                />

                <input
                  type="file"
                  className="form-control mb-2"
                  accept="image/*"
                  onChange={(e) => setLogo(e.target.files[0])}
                />

                {edit?.logo && !logo && (
                  <small className="text-success">
                    ✔ Existing logo will be kept
                  </small>
                )}

                <label className="d-block mt-2">
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
                  Show Experience
                </label>

                <button className="btn btn-success w-100 mt-3">
                  Save Experience
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Experience;