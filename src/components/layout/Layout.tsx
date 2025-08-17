import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Package, 
  Users, 
  ClipboardList,
  Settings,
  LogOut,
  Bell,
  ChevronDown,
  Home,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import ThemeToggle from '../common/ThemeToggle';
import Dock from '../common/Dock';

interface LayoutProps {
  children: ReactNode;
  title: string;
}

export const Layout = ({ children, title }: LayoutProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const navItems = [
    {
      to: '/dashboard',
      icon: <Home className="h-5 w-5" />,
      label: 'Dashboard',
      exact: true,
      showAlways: true
    },
    {
      to: '/inventory',
      icon: <Package className="h-5 w-5" />,
      label: 'Items',
      showAlways: true
    },
    {
      to: '/users',
      icon: <Users className="h-5 w-5" />,
      label: 'Users',
      requiresManager: true
    },
    {
      to: '/activity',
      icon: <ClipboardList className="h-5 w-5" />,
      label: 'Logs',
      showAlways: true
    },
    {
      to: '/alerts',
      icon: <Bell className="h-5 w-5" />,
      label: 'Alerts',
      showAlways: true
    },
    {
      to: '/roles',
      icon: <ShieldCheck className="h-5 w-5" />,
      label: 'Roles',
      requiresManager: true
    },
    {
      to: '/settings',
      icon: <Settings className="h-5 w-5" />,
      label: 'Setup',
      showAlways: true
    }
  ];

  // Filter navigation items
  const filteredNavItems = navItems.filter(item => {
    if (item.requiresManager && user?.role !== 'manager') return false;
    if (!item.showAlways && !item.requiresManager) return false;
    return true;
  });

  // Create dock items from navigation items
  const dockItems = filteredNavItems.map(item => ({
    icon: item.icon,
    label: item.label,
    onClick: () => navigate(item.to),
    className: location.pathname === item.to || (item.exact && location.pathname === item.to) || (!item.exact && location.pathname.startsWith(item.to)) 
      ? 'bg-gradient-to-r from-light-primary to-light-accent dark:from-dark-primary dark:to-dark-accent text-white shadow-lg' 
      : ''
  }));
  return (
    <div className="min-h-screen bg-theme text-theme flex flex-col theme-transition">
      {/* Navbar */}
      <header className="sticky top-0 z-50 nav-header theme-transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3 group cursor-pointer">
              <Package className="h-8 w-8 text-theme transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 drop-shadow-sm" />
              <span className="text-xl font-bold text-theme transition-all duration-300 group-hover:scale-105 bg-gradient-to-r from-light-primary to-light-accent dark:from-dark-primary dark:to-dark-accent bg-clip-text text-transparent">
                Inventory
              </span>
            </div>

            {/* Center Navigation - Dock Style */}
            <div className="hidden md:flex items-center justify-center flex-1 px-8 relative">
              <Dock 
                items={dockItems}
                className="!relative"
                panelHeight={68}
                baseItemSize={50}
                magnification={70}
                distance={150}
              />
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <ThemeToggle />
              
              <div className="relative group">
                <button className="flex items-center gap-3 p-2 rounded-xl transition-all duration-500 hover-theme theme-transition">
                  <div className="h-11 w-11 rounded-full bg-gradient-to-r from-light-primary to-light-accent dark:from-dark-primary dark:to-dark-accent p-0.5 transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-light-primary/30 dark:group-hover:shadow-dark-primary/30">
                    <div className="h-full w-full rounded-full bg-white dark:bg-dark-card flex items-center justify-center text-light-primary dark:text-dark-primary font-bold text-lg transition-all duration-500 group-hover:text-white group-hover:bg-gradient-to-r group-hover:from-light-primary group-hover:to-light-accent dark:group-hover:from-dark-primary dark:group-hover:to-dark-accent">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  </div>
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="text-sm font-semibold text-theme transition-all duration-300">
                      {user?.name || 'User'}
                    </span>
                    <span className="text-xs text-theme-secondary transition-all duration-300">
                      {user?.role === 'manager' ? 'Manager' : 'Staff'}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-theme transition-all duration-500 group-hover:rotate-180" />
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-3 w-52 bg-white/95 dark:bg-dark-card border border-theme rounded-xl shadow-xl dark:shadow-glass-dark opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 backdrop-blur-glass">
                  <div className="py-2">
                    <div className="px-4 py-3 border-b border-theme">
                      <p className="text-sm font-semibold text-theme">{user?.name || 'User'}</p>
                      <p className="text-xs text-theme-secondary">{user?.email || 'user@example.com'}</p>
                    </div>
                    <button 
                      onClick={logout}
                      className="block w-full text-left px-4 py-3 text-sm rounded-lg mx-2 my-1 transition-all duration-300 text-error-600 hover:bg-error-50 dark:hover:bg-error-900/20 hover:scale-105"
                    >
                      <div className="flex items-center gap-3">
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
        <Dock 
          items={dockItems.slice(0, 5)}
          panelHeight={68}
          baseItemSize={45}
          magnification={60}
          distance={120}
        />
      </div>

      {/* Main Content */}
      <motion.main 
        className="flex-1 p-4 md:p-6 lg:p-8 theme-transition pb-24 md:pb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-theme">{title}</h1>
          </div>
          
          {children}
        </div>
      </motion.main>
    </div>
  );
};