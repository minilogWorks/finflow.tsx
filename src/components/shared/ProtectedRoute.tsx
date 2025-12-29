// src/components/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { PropsWithChildren } from "react";

export default function ProtectedRoute({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to login, saving the location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return { children }; // Renders the child routes
}
