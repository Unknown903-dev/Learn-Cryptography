import { Link, NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        CipherQuest
      </Link>

      <div className="nav-links">
        <NavLink to="/lessons">Lessons</NavLink>
        <NavLink to="/bayes-theorem">Bayes</NavLink>
        <NavLink to="/perfect-secrecy">Perfect Secrecy</NavLink>
        <NavLink to="/attack-simulator">Attack Simulator</NavLink>
        <NavLink to="/practice">Practice</NavLink>
      </div>
    </nav>
  );
}

export default Navbar;