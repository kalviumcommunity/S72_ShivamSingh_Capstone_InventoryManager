import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Loader } from './components/common/Loader';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import AuthCallback from './pages/Auth/AuthCallback';
import DashboardPage from './pages/Dashboard/DashboardPage';
import InventoryListPage from './pages/Inventory/InventoryListPage';
import CategoryPage from './pages/Inventory/CategoryPage';
import InventoryItemPage from './pages/Inventory/InventoryItemPage';
import AddInventoryItemPage from './pages/Inventory/AddInventoryItemPage';
import EditInventoryItemPage from './pages/Inventory/EditInventoryItemPage';
import UsersPage from './pages/Users/UsersPage';
import ActivityLogPage from './pages/Activity/ActivityLogPage';
import AlertsPage from './pages/Alerts/AlertsPage';
import RolesPage from './pages/Roles/RolesPage';
import SettingsPage from './pages/Settings/SettingsPage';
import ProfilePage from './pages/Profile/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleProtectedRoute from './components/auth/RoleProtectedRoute';

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      
      {/* Protected Routes - Require Authentication */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/inventory" element={<InventoryListPage />} />
        <Route path="/inventory/category/:categoryId" element={<CategoryPage />} />
        <Route path="/inventory/:id" element={<InventoryItemPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        
        {/* Manager-only routes */}
        <Route element={<RoleProtectedRoute allowedRoles={['manager']} />}>
          <Route path="/inventory/add" element={<AddInventoryItemPage />} />
          <Route path="/inventory/:id/edit" element={<EditInventoryItemPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/roles" element={<RolesPage />} />
        </Route>
        
        <Route path="/activity" element={<ActivityLogPage />} />
      </Route>
      
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes; 