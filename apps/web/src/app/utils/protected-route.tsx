import { Navigate, Outlet } from "react-router-dom";
import React from "react";
import { NavBar } from "../components/navbar/navbar.tsx";
import { useAuth } from "../context/auth.context.tsx";

export function ProtectedRoute() {
  const { user } = useAuth();

  // Check if the user is authenticated
  if (!user) {
    // If not authenticated, redirect to the login page
    return <Navigate to="/login" />;
  }

  return (
    <div style={{ height: "100vh" }}>
      <NavBar />
      <Outlet />
    </div>
  );
}
