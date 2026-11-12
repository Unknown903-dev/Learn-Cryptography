import { Link, NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <img className="logo-mark" src="/favicon.svg" alt="" aria-hidden="true" />
        <span>Learn Crypto</span>
      </Link>

      <div className="nav-links">
        <NavLink to="/lessons">Lessons</NavLink>
        <NavLink to="/bayes-theorem">Bayes</NavLink>
        <NavLink to="/perfect-secrecy">Perfect Secrecy</NavLink>
        <NavLink to="/modes">CBC/CTR</NavLink>
        <NavLink to="/attack-simulator">Attack Simulator</NavLink>
        <NavLink to="/practice">Practice</NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
