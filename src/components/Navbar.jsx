import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-black px-4">
      <span className="nev-head">Dashboard</span>

      <button className="btn btn-outline-danger btn-sm" onClick={logout}>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
