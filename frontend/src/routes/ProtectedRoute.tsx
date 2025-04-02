import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface ProtectedRouteProps {
  requiredRole?: "user" | "mentor" | "admin";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const { accessToken, status, user } = useSelector(
    (state: RootState) => state.auth,
  );

  if (status === "loading") {
    return (
      <div className="container mx-auto px-8 py-8 flex h-screen justify-center items-center">
        Loading...
      </div>
    );
  }

  if (!accessToken && requiredRole === "admin")
    return <Navigate to="/admin/login" />;
  if (!accessToken) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
