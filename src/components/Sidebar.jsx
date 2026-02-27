import { NavLink, useNavigate } from "react-router-dom";
import {
  LuLayoutDashboard,
  LuSparkles, // ✅ Hero ke liye better icon
  LuUser,
  LuFolderKanban,
  LuCode,
  LuBriefcase,
  LuFileText,
  LuMail,
  LuShare2, // ✅ Social Media
  LuLogOut,
  LuSettings,
  LuLink,
  LuCast,
  LuTags,
} from "react-icons/lu";

import "../assets/css/admin-theme.css";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  return (
    <div className="sidebar">
      <h5 className="sidebar-title">Admin Panel</h5>
      <p className="sidebar-sub">Portfolio Management</p>

      <NavLink to="/dashboard" className="sidebar-link">
        <LuLayoutDashboard /> Dashboard
      </NavLink>

      {/* 🔥 HERO SECTION */}
      <NavLink to="/hero" className="sidebar-link">
        <LuSparkles /> Hero
      </NavLink>

      <NavLink to="/about" className="sidebar-link">
        <LuUser /> About
      </NavLink>

      <NavLink to="/projects" className="sidebar-link">
        <LuFolderKanban /> Projects
      </NavLink>

      <NavLink to="/skills" className="sidebar-link">
        <LuCode /> Skills
      </NavLink>

      <NavLink to="/experience" className="sidebar-link">
        <LuBriefcase /> Experience
      </NavLink>

      <NavLink to="/blogs" className="sidebar-link">
        <LuFileText /> Blog
      </NavLink>

      <NavLink to="/contact" className="sidebar-link">
        <LuMail /> Contact
      </NavLink>

      <NavLink to="/services" className="sidebar-link">
        <LuSettings /> Services
      </NavLink>

      <NavLink to="/ProjectCategories" className="sidebar-link">
        <LuTags /> Category
      </NavLink>

      {/* 🌍 GLOBAL SOCIAL MEDIA SETTINGS */}
      <NavLink to="/settings" className="sidebar-link">
        <LuShare2 /> Social Media
      </NavLink>

      <button
        className="btn btn-outline-danger mt-auto w-100"
        onClick={handleLogout}
      >
        <LuLogOut /> Logout
      </button>
    </div>
  );
};

export default Sidebar;
