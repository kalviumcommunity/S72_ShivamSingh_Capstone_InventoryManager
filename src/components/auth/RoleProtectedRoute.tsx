import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface RoleProtectedRouteProps {
  allowedRoles: string[];
}

const RoleProtectedRoute = ({ allowedRoles }: RoleProtectedRouteProps) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return null;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Get user role from custom claims or user metadata
  const userRole = user.customClaims?.role || 'staff';

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default RoleProtectedRoute;