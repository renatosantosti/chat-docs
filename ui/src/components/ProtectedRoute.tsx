import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthRequest } from "@/store/auth/slices";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  // Check if user is authenticated
  const isAuthenticated = useSelector(
    (state: any) => state.auth?.isAuthenticated,
  );
  const user = useSelector((state: any) => state.auth?.user);

  useEffect(() => {
    // Always check auth when component mounts
    dispatch(checkAuthRequest());
  }, [dispatch]);

  // If user is authenticated, render children
  if (isAuthenticated && user) {
    return <>{children}</>;
  }

  // If not authenticated, redirect to login
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;
