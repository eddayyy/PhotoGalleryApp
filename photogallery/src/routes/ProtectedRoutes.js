import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem("token") != null;

  // If not authenticated, redirect to the home page
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Render the child routes if authenticated
  return <Outlet />;
};

export default ProtectedRoute;
