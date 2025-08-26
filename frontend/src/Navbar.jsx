import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const initialUsername = storedUser ? JSON.parse(storedUser).name : "Guest";
  const [username, setUsername] = useState(initialUsername);

  const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUsername("Guest");
      navigate("/signin");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2 onClick={() => navigate('/dashboard')}>Welcome, {username}</h2>
      </div>
      <div className="navbar-right">
        <Link to="/interviews" className="nav-link">
          Interviews
        </Link>
        {username !== "Guest" && (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar