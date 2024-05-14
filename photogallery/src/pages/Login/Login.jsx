import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import { useUser } from "../../util/UserContext";

const Login = () => {
  const navigate = useNavigate();
  const { user, login, logout } = useUser();
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/login/",
        loginData,
        { withCredentials: true }
      );
      console.log("Received data:", response.data); // Log the received data
      const token = response.data.token;
      login(response.data.user);
      localStorage.setItem("token", token);
      navigate("/gallery");
      console.log(token);
    } catch (err) {
      console.error("Error during login:", err);
      setError(
        "Login failed. Please check your username and password and try again."
      );
    }
  };

  if (user) {
    return (
      <div className="login-container">
        <h2>Welcome, {user.username}!</h2>
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>
    );
  }

  // If user is not logged in, display the login form
  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login to Your Account</h2>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
            value={loginData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={loginData.password}
            onChange={handleChange}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="login-btn">
          Login
        </button>
        <div className="signup-link">
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
