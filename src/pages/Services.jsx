import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import api from "../services/adminApi";

const Services = () => {
  const [list, setList] = useState([]);
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(null);

  const initialForm = {
    title: "",
    icon: "",
    points: "",
    isActive: true,
  };

  const [form, setForm] = useState(initialForm);

  const fetchData = async () => {
    const res = await api.get("/admin/services");
    setList(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    const payload = {
      title: form.title,
      icon: form.icon,
      isActive: form.isActive,
      points: form.points
        .split("\n")
        .map((p) => p.trim())
        .filter(Boolean),
    };

    if (edit) {
      await api.put(`/admin/services/${edit._id}`, payload);
    } else {
      await api.post("/admin/services", payload);
    }

    closeModal();
    fetchData();
  };

  const openEdit = (s) => {
    setEdit(s);
    setForm({
      title: s.title,
      icon: s.icon,
      points: s.points.join("\n"),
      isActive: s.isActive,
    });
    setShow(true);
  };

  const closeModal = () => {
    setShow(false);
    setEdit(null);
    setForm(initialForm);
  };

  return (
    <AdminLayout>
      <div className="glass-card p-4">
        <div className="d-flex justify-content-between mb-3">
          <h4 className="color-white">Services</h4>
          <button className="btn btn-primary" onClick={() => setShow(true)}>
            + Add Service
          </button>
        </div>

        <div className="row">
          {list.map((s) => (
            <div className="col-md-4 mb-3" key={s._id}>
              <div className="card p-3">
                <h6>{s.title}</h6>
                <small>Icon: {s.icon}</small>

                <ul className="mt-2">
                  {s.points.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>

                <div className="mt-2">
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => openEdit(s)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() =>
                      api.delete(`/admin/services/${s._id}`).then(fetchData)
                    }
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
              <div className="d-flex justify-content-between mb-2">
                <h5>{edit ? "Edit Service" : "Add Service"}</h5>
                <button className="close-btn" onClick={closeModal}>
                  ×
                </button>
              </div>

              <form onSubmit={submit}>
                <input
                  className="form-control mb-2"
                  placeholder="Service Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />

                <input
                  className="form-control mb-2"
                  placeholder="React Icon name (FaCode)"
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  required
                />

                <textarea
                  className="form-control mb-2"
                  rows="5"
                  placeholder={`One point per line\nExample:\nResponsive UI\nAPI Integration\nSEO Friendly`}
                  value={form.points}
                  onChange={(e) => setForm({ ...form, points: e.target.value })}
                  required
                />

                <label>
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) =>
                      setForm({ ...form, isActive: e.target.checked })
                    }
                  />{" "}
                  Show Service
                </label>

                <button className="btn btn-success w-100 mt-3">
                  Save Service
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Services;
