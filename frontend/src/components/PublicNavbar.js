import { Link } from "react-router-dom";

function PublicNavbar() {
  return (
    <nav className="pub-nav">
      <Link to="/" className="pub-nav-logo">💳 PayPanda</Link>
      <div className="pub-nav-links">
        <a href="#features" className="pub-nav-link">Features</a>
        <a href="#about"    className="pub-nav-link">About</a>
        <Link to="/login"    className="pub-nav-link">Login</Link>
        <Link to="/register" className="pp-btn pp-btn-primary" style={{padding:"9px 20px",fontSize:"14px"}}>
          Get Started
        </Link>
      </div>
    </nav>
  );
}

export default PublicNavbar;
