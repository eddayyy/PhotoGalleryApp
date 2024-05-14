import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedLoggedInRoute = () => {
  const isAuthenticated = localStorage.getItem("token") !== null;

  // If authenticated, redirect to the home page
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  // Render the child routes if authenticated
  return <Outlet />;
};

export default ProtectedLoggedInRoute;
