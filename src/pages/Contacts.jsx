import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import api from "../services/adminApi";

const Contacts = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await api.get("/contact");
      setList(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch contacts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const remove = async (id) => {
    if (window.confirm("Delete this lead?")) {
      try {
        await api.delete(`/contact/${id}`);
        fetchData();
      } catch (err) {
        console.error("❌ Delete failed:", err);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="glass-card p-4">
        <h4 className="color-white">Contact Leads</h4>

        {loading ? (
          <p className="text-light">Loading...</p>
        ) : (
          <table className="table mt-3">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Message</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {list.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-light">
                    No Leads Found
                  </td>
                </tr>
              ) : (
                list.map((c) => (
                  <tr key={c._id}>
                    <td>{c.name}</td>
                    <td>{c.email}</td>
                    <td>{c.phone}</td>
                    <td>{c.message}</td>
                    <td>{new Date(c.createdAt).toLocaleString()}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => remove(c._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

export default Contacts;
