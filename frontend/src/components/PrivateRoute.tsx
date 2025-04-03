import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const isGuest = user?.isGuest;

  // Allow access if authenticated (including guest users)
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Redirect to login if not authenticated
  return <Navigate to="/login" replace />;
};

export default PrivateRoute; 