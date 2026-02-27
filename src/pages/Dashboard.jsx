import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import api from "../services/adminApi";
import "../assets/css/admin-theme.css";

import {
  LuFolderKanban,
  LuFileText,
  LuCode,
  LuBriefcase,
} from "react-icons/lu";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);

  /* ================= FETCH DASHBOARD STATS ================= */
  const fetchDashboard = async () => {
    try {
      const res = await api.get("/admin/dashboard");
      setStats(res.data);
    } catch (err) {
      console.error("Dashboard stats error", err);
    }
  };

  /* ================= FETCH RECENT PROJECTS ================= */
  const fetchRecentProjects = async () => {
    try {
      const res = await api.get("/admin/projects");
      setRecentProjects(res.data.slice(0, 5));
    } catch (err) {
      console.error("Recent projects error", err);
    }
  };

  /* ================= FETCH RECENT BLOGS ================= */
  const fetchRecentBlogs = async () => {
    try {
      const res = await api.get("/admin/blogs");
      setRecentBlogs(res.data.slice(0, 5));
    } catch (err) {
      console.error("Recent blogs error", err);
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchRecentProjects();
    fetchRecentBlogs();
  }, []);

  if (!stats) {
    return (
      <AdminLayout>
        <p className="text-white p-4">Loading dashboard...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mainSecDesh p-4">
        <p className="mb-4 text-white">
          Welcome back! Here's an overview of your portfolio.
        </p>

        {/* ================= TOP STATS ================= */}
        <div className="row g-4">
          <DashboardCard
            title="Total Projects"
            value={stats.projects}
            icon={<LuFolderKanban />}
          />
          <DashboardCard
            title="Categories"
            value={stats.categories}
            icon={<LuCode />}
          />
          <DashboardCard
            title="Skills"
            value={stats.skills}
            icon={<LuCode />}
          />
          <DashboardCard
            title="Experience"
            value={stats.experience}
            icon={<LuBriefcase />}
          />
        </div>

        {/* ================= RECENT SECTIONS ================= */}
        <div className="row g-4 mt-4">
          {/* RECENT PROJECTS */}
          <div className="col-md-6">
            <div className="glass-card">
              <h6 className="section-title">Recent Projects</h6>
              <p className="section-sub">Your latest project additions</p>

              <ul className="list-unstyled mt-3">
                {recentProjects.length ? (
                  recentProjects.map((p) => (
                    <li className="item" key={p._id}>
                      <strong>{p.title}</strong>
                      <span>{p.shortDescription}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-muted">No projects added yet</li>
                )}
              </ul>

              <button className="btn btn-outline-info btn-sm w-100 mt-3">
                View All Projects
              </button>
            </div>
          </div>

          {/* RECENT BLOGS */}
          <div className="col-md-6">
            <div className="glass-card">
              <h6 className="section-title">Recent Blog Posts</h6>
              <p className="section-sub">Your latest blog entries</p>

              <ul className="list-unstyled mt-3">
                {recentBlogs.length ? (
                  recentBlogs.map((b) => (
                    <li className="item" key={b._id}>
                      <strong>{b.title}</strong>
                      <span>{b.shortDescription}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-muted">No blogs added yet</li>
                )}
              </ul>

              <button className="btn btn-outline-info btn-sm w-100 mt-3">
                View All Blogs
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

const DashboardCard = ({ title, value, icon }) => (
  <div className="col-md-3">
    <div className="stat-card position-relative">
      <div className="stat-icon">{icon}</div>
      <p className="stat-title">{title}</p>
      <h2 className="text-white">{value}</h2>
      <span className="manage-link">Manage →</span>
    </div>
  </div>
);

export default Dashboard;
