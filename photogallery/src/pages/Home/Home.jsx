import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to the Photo Gallery App!</h1>
      <p>
        This app allows you to securely store and share your photos with friends
        and family. Sign up to start your album or login to view your gallery.
      </p>
      <div className="navigation-links">
        <Link to="/signup" className="nav-link">
          Sign Up
        </Link>
        <Link to="/login" className="nav-link">
          Login
        </Link>
      </div>
      <div className="icons-container">
        <i className="fas fa-camera-retro icon"></i>
        <i className="fas fa-images icon"></i>
      </div>
    </div>
  );
};

export default Home;
