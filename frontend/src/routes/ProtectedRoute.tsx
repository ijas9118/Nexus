import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { UserRoles } from "@/types/user";

interface ProtectedRouteProps {
  requiredRoles: UserRoles[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRoles }) => {
  const { accessToken, status, user } = useSelector(
    (state: RootState) => state.auth,
  );

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-9 w-9 border-4 border-gray-200 border-t-blue-500"></div>
      </div>
    );
  }

  if (!accessToken) {
    return requiredRoles.includes("admin") ? (
      <Navigate to="/admin/login" replace />
    ) : (
      <Navigate to="/login" replace />
    );
  }

  if (requiredRoles && !requiredRoles.includes(user?.role as UserRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
