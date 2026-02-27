import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import api from "../services/adminApi";
import "../assets/css/modal.css";

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editSkill, setEditSkill] = useState(null);

  const [form, setForm] = useState({
    name: "",
    icon: "",
    level: 0,
    isActive: true,
  });

  /* ================= FETCH ================= */
  const fetchSkills = async () => {
    const res = await api.get("/admin/skills");
    setSkills(res.data);
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  /* ================= CLOSE MODAL ================= */
  const closeModal = () => {
    setShowModal(false);
    setEditSkill(null);
    setForm({
      name: "",
      icon: "",
      level: 0,
      isActive: true,
    });
  };

  /* ================= SAVE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editSkill) {
      await api.put(`/admin/skills/${editSkill._id}`, form);
    } else {
      await api.post("/admin/skills", form);
    }

    closeModal();
    fetchSkills();
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (window.confirm("Delete this skill?")) {
      await api.delete(`/admin/skills/${id}`);
      fetchSkills();
    }
  };

  return (
    <AdminLayout>
      <div className="glass-card p-4">
        <div className="d-flex justify-content-between mb-3">
          <h4 className="color-white">Skills</h4>
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            + Add Skill
          </button>
        </div>

        {/* ================= SKILLS LIST ================= */}
        <div className="row">
          {skills.map((skill) => (
            <div className="col-md-4 mb-3" key={skill._id}>
              <div className="card p-3">
                <h6>
                  <i className={`${skill.icon} me-2`} />
                  {skill.name}
                </h6>

                <p className="mb-1">Level: {skill.level}%</p>
                <p>Status: {skill.isActive ? "Show" : "Hide"}</p>

                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => {
                      setEditSkill(skill);
                      setForm(skill);
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(skill._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ================= MODAL ================= */}
        {showModal && (
          <div className="modal-backdrop skill-modal">
            <div className="modal-box">
              {/* ❌ CLOSE BUTTON */}
              <button className="modal-close" onClick={closeModal}>
                ×
              </button>

              <h5 className="mb-3">{editSkill ? "Edit Skill" : "Add Skill"}</h5>

              <form onSubmit={handleSubmit}>
                <input
                  className="form-control mb-2"
                  placeholder="Skill Name (HTML, React)"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />

                <input
                  className="form-control mb-2"
                  placeholder="Font Awesome Icon (fa-brands fa-react)"
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  required
                />

                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="Skill Level %"
                  min="0"
                  max="100"
                  value={form.level}
                  onChange={(e) => setForm({ ...form, level: e.target.value })}
                  required
                />

                <label className="d-block mb-3">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) =>
                      setForm({ ...form, isActive: e.target.checked })
                    }
                  />{" "}
                  Show Skill
                </label>

                <button className="btn btn-success w-100">Save Skill</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Skills;
