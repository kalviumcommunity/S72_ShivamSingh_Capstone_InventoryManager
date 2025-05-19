import React, { useState } from 'react';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import { motion } from 'framer-motion';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const sidebarWidth = isSidebarCollapsed ? 80 : 256; // Define widths here

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-[#0f1117] via-[#1a1d2a] to-[#0f1117] overflow-hidden">
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      {/* Fixed Navbar */}
      <div className="flex-none">
        <Navbar />
      </div>

      {/* Main Content Area with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Fixed Sidebar */}
        <motion.div
          initial={{ width: 256 }}
          animate={{ width: sidebarWidth }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex-none"
        >
          <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
        </motion.div>

        {/* Scrollable Main Content */}
        <motion.main
          initial={{ width: 'calc(100% - 256px)' }}
          animate={{ width: `calc(100% - ${sidebarWidth}px)` }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex-1 overflow-y-auto"
        >
          <div className="max-w-7xl mx-auto p-6 md:p-8 lg:p-10">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-6 md:p-8">
              {/* Pass sidebar state to children */}
              {React.Children.map(children, child => {
                if (React.isValidElement(child)) {
                  return React.cloneElement(child, { isSidebarCollapsed, sidebarWidth });
                }
                return child;
              })}
            </div>
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default MainLayout; 