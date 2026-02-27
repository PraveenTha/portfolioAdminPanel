import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import api from "../services/adminApi";
import "../assets/css/projectCategories.css";

const ProjectCategories = () => {
  const [list, setList] = useState([]);
  const [name, setName] = useState("");
  const [edit, setEdit] = useState(null);

  const fetchData = async () => {
    const res = await api.get("/admin/project-categories");
    setList(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    if (edit) {
      await api.put(`/admin/project-categories/${edit._id}`, {
        name,
        isActive: edit.isActive,
      });
    } else {
      await api.post("/admin/project-categories", {
        name,
      });
    }

    setName("");
    setEdit(null);
    fetchData();
  };

  const remove = async (id) => {
    if (confirm("Delete category?")) {
      await api.delete(`/admin/project-categories/${id}`);
      fetchData();
    }
  };

  return (
    <AdminLayout>
      <div className="glass-card p-4">
        <h4 className="mb-3 color-white ">Project Categories</h4>

        {/* ADD FORM */}
        <form onSubmit={submit} className="d-flex gap-2 mb-4">
          <input
            className="form-control"
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <button className="btn btn-primary">{edit ? "Update" : "Add"}</button>
        </form>

        {/* LIST */}
        {list.map((c) => (
          <div key={c._id} className="category-row">
            <span className="color-white">{c.name}</span>

            <div>
              <button
                className="btn btn-sm btn-warning me-2"
                onClick={() => {
                  setEdit(c);
                  setName(c.name);
                }}
              >
                Edit
              </button>

              <button
                className="btn btn-sm btn-danger"
                onClick={() => remove(c._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default ProjectCategories;
