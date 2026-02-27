import { useEffect, useRef, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import api from "../services/adminApi";
import Quill from "quill";
import "quill/dist/quill.snow.css";

/* ================= DATE FORMATTER ================= */
const formatDateTime = (date) => {
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(null);
  const [image, setImage] = useState(null);

  const editorRef = useRef(null);
  const quillInstance = useRef(null);

  const initialForm = {
    title: "",
    shortDescription: "",
    tags: "",
    isPublished: true,
  };

  const [form, setForm] = useState(initialForm);

  /* ================= FETCH ================= */
  const fetchBlogs = async () => {
    const res = await api.get("/admin/blogs");
    setBlogs(res.data);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  /* ================= INIT QUILL ================= */
  useEffect(() => {
    if (show && editorRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Write blog content here...",
      });

      if (edit?.content) {
        quillInstance.current.root.innerHTML = edit.content;
      }
    }
  }, [show, edit]);

  /* ================= SUBMIT ================= */
  const submit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("shortDescription", form.shortDescription);
    fd.append(
      "content",
      quillInstance.current
        ? quillInstance.current.root.innerHTML
        : ""
    );
    fd.append("tags", JSON.stringify(form.tags.split(",")));
    fd.append("isPublished", form.isPublished);

    if (image) fd.append("image", image);

    if (edit) {
      await api.put(`/admin/blogs/${edit._id}`, fd);
    } else {
      await api.post("/admin/blogs", fd);
    }

    closeModal();
    fetchBlogs();
  };

  /* ================= HELPERS ================= */
  const openAdd = () => {
    setEdit(null);
    setForm(initialForm);
    setImage(null);
    quillInstance.current = null;
    setShow(true);
  };

  const openEdit = (b) => {
    setEdit(b);
    setForm({
      title: b.title,
      shortDescription: b.shortDescription,
      tags: b.tags.join(","),
      isPublished: b.isPublished,
    });
    setImage(null);
    quillInstance.current = null;
    setShow(true);
  };

  const closeModal = () => {
    setShow(false);
    setEdit(null);
    setForm(initialForm);
    setImage(null);
    quillInstance.current = null;
  };

  const remove = async (id) => {
    if (!window.confirm("Delete blog?")) return;
    await api.delete(`/admin/blogs/${id}`);
    fetchBlogs();
  };

  return (
    <AdminLayout>
      <div className="glass-card p-4">
        <div className="d-flex justify-content-between mb-3">
          <h4 className="color-white">Blogs</h4>
          <button className="btn btn-primary" onClick={openAdd}>
            + Add Blog
          </button>
        </div>

        {/* LIST */}
        {blogs.map((b) => (
          <div
            key={b._id}
            className="border-bottom py-3 d-flex justify-content-between align-items-center"
          >
            <div>
              <strong className="color-white d-block">
                {b.title}
              </strong>
              <small className="color-white">
                {formatDateTime(b.createdAt)}
              </small>
            </div>

            <div>
              <button
                className="btn btn-sm btn-warning me-2"
                onClick={() => openEdit(b)}
              >
                Edit
              </button>

              <button
                className="btn btn-sm btn-danger"
                onClick={() => remove(b._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {/* MODAL */}
        {show && (
          <div className="modal-backdrop skill-modal">
            <div className="modal-box large">
              <div className="d-flex justify-content-between mb-2">
                <h5>{edit ? "Edit Blog" : "Add Blog"}</h5>
                <button onClick={closeModal}>✕</button>
              </div>

              <form onSubmit={submit}>
                <input
                  className="form-control mb-2"
                  placeholder="Title"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  required
                />

                <textarea
                  className="form-control mb-2"
                  placeholder="Short Description"
                  value={form.shortDescription}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      shortDescription: e.target.value,
                    })
                  }
                />

                {/* QUILL */}
                <div
                  ref={editorRef}
                  style={{ height: "200px", marginBottom: "12px" }}
                />

                <input
                  className="form-control mb-2"
                  placeholder="Tags (react,node)"
                  value={form.tags}
                  onChange={(e) =>
                    setForm({ ...form, tags: e.target.value })
                  }
                />

                <input
                  type="file"
                  className="form-control mb-2"
                  onChange={(e) => setImage(e.target.files[0])}
                />

                <label className="mb-2 d-block">
                  <input
                    type="checkbox"
                    checked={form.isPublished}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        isPublished: e.target.checked,
                      })
                    }
                  />{" "}
                  Publish
                </label>

                <button className="btn btn-success w-100">
                  Save Blog
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Blogs;
