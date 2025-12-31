import { Navigate, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { PropsWithChildren } from "react";
import Loader from "./Loader";

export default function ProtectedRoute({ children }: PropsWithChildren) {
  const { isAuthenticated, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    // Redirect to login, saving the location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
