import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar-container">
      <div className="brand-title">
        <a href="/" className="snap-vault">
          SnapVault
        </a>
      </div>
      <div className="navbar-links">
        <Link to="/gallery" className="navbar-link">
          <i className="fas fa-photo-video"></i> Gallery
        </Link>
        <Link to="/signup" className="navbar-link">
          <i className="fas fa-user-plus"></i> Sign Up
        </Link>
        <Link to="/login" className="navbar-link">
          <i className="fas fa-sign-in-alt"></i> Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
