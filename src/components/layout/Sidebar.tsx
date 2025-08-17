import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ClipboardList, 
  Settings, 
  LogOut, 
  X,
  User,
  ChevronDown,
  Home,
  ShieldCheck,
  Bell
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types/user';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  role: UserRole;
}

export const Sidebar = ({ isOpen, toggleSidebar, role }: SidebarProps) => {
  const { logout, user } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  
  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } }
  };
  
  const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center gap-3 py-3 px-4 rounded-lg transition-colors ${
      isActive 
        ? 'bg-primary-50 text-primary-700 font-medium' 
        : 'text-gray-600 hover:bg-gray-100'
    }`;

  const navItems = [
    {
      to: '/',
      icon: <Home className="h-5 w-5" />,
      label: 'Home',
      exact: true,
      showAlways: true
    },
    {
      to: '/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: 'Dashboard',
      showAlways: true
    },
    {
      to: '/inventory',
      icon: <Package className="h-5 w-5" />,
      label: 'Inventory',
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
      label: 'Activity Log',
      showAlways: true
    },
    {
      to: '/notifications',
      icon: <Bell className="h-5 w-5" />,
      label: 'Notifications',
      showAlways: true
    },
    {
      to: '/roles',
      icon: <ShieldCheck className="h-5 w-5" />,
      label: 'Role Management',
      requiresManager: true
    },
    {
      to: '/settings',
      icon: <Settings className="h-5 w-5" />,
      label: 'Settings',
      showAlways: true
    }
  ];
  
  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar */}
      <motion.aside 
        className="fixed inset-y-0 left-0 z-40 w-64 bg-white/80 backdrop-blur-glass border-r border-gray-200/50 flex flex-col transform md:translate-x-0"
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
      >
        <div className="p-4 border-b border-gray-200/50 flex items-center justify-between bg-white/50">
          <div className="flex items-center">
            <Package className="h-6 w-6 text-primary-600" />
            <h1 className="ml-2 text-xl font-bold text-gray-800">Inventory</h1>
          </div>
          <button 
            className="p-1 rounded-full hover:bg-gray-100 md:hidden"
            onClick={toggleSidebar}
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-2">
            {navItems.map((item) => {
              if (item.requiresManager && role !== 'manager') return null;
              if (!item.showAlways && !item.requiresManager) return null;
              
              return (
                <li key={item.to}>
                  <NavLink 
                    to={item.to} 
                    className={navLinkClass}
                    onClick={() => toggleSidebar()}
                    end={item.exact}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="border-t border-gray-200/50 p-3 bg-white/50">
          <div className="relative">
            <button 
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <div className="flex-shrink-0 h-9 w-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">
                {user?.name?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.role === 'manager' ? 'Store Manager' : 'Staff Member'}
                </p>
              </div>
              <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {profileOpen && (
                <motion.div 
                  className="absolute bottom-full left-0 right-0 mb-2 bg-white/90 rounded-lg shadow-glass border border-gray-200/50 overflow-hidden backdrop-blur-glass"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <NavLink 
                    to="/profile" 
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                    onClick={() => {
                      setProfileOpen(false);
                      toggleSidebar();
                    }}
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </NavLink>
                  <NavLink 
                    to="/settings" 
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                    onClick={() => {
                      setProfileOpen(false);
                      toggleSidebar();
                    }}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </NavLink>
                  <button 
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    onClick={() => {
                      logout();
                      setProfileOpen(false);
                      toggleSidebar();
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>
    </>
  );
};