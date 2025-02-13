import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store"; // Adjust the path based on your project structure

const ProtectedRoute: React.FC = () => {
  const { accessToken, status } = useSelector((state: RootState) => state.auth);

  if (status === "loading") {
    return (
      <div className="container mx-auto px-8 py-8 flex h-screen justify-center items-center">
        Loading...
      </div>
    );
  }

  return accessToken ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
