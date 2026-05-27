import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

/**
 * Premium dashboard layout wrapping protected pages.
 */
const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Map URLs to visual page headers
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard Command Center';
      case '/tasks':
        return 'Task & Checklist Boards';
      case '/pomodoro':
        return 'Focus Pomodoro Space';
      case '/analytics':
        return 'Productivity Metrics';
      case '/profile':
        return 'SaaS Profile & Badges';
      default:
        return 'Aura Dashboard';
    }
  };

  return (
    <div className="w-full min-h-screen flex bg-dark-900 text-gray-100 overflow-hidden">
      
      {/*Collapsible left sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Primary view content block */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative overflow-y-auto">
        
        {/* Background visual glowing gradients */}
        <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-glow-primary pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-glow-secondary pointer-events-none" />

        <Navbar 
          pageTitle={getPageTitle()} 
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        
        {/* Render nested children routes pages */}
        <main className="flex-1 overflow-x-hidden relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
