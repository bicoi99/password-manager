import { Link } from "react-router-dom";

const Navbar = ({ username, logout }) => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <h1>Password Manager</h1>
        <ul>
          <li>
            <h4>{username}</h4>
          </li>
          <li className="btn">
            <Link to="/login" onClick={logout}>
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
