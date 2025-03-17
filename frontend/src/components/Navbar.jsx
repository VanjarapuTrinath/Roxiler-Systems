import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav style={{ display: "flex", justifyContent: "space-between", padding: "10px", background: "#111" }}>
      <h2 style={{ color: "yellow" }}>Store Rating App</h2>
      <div>
        <Link to="/" style={{ margin: "10px", color: "white" }}>Home</Link>
        {!token ? (
          <>
            <Link to="/signup" style={{ margin: "10px", color: "white" }}>Signup</Link>
            <Link to="/login" style={{ margin: "10px", color: "white" }}>Login</Link>
          </>
        ) : (
          <button onClick={handleLogout} style={{ margin: "10px", background: "yellow", padding: "5px 10px" }}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
