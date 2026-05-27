import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Trello, 
  Timer, 
  BarChart3, 
  User, 
  X, 
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Detailed Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Focus Space', path: '/pomodoro', icon: Timer },
    { name: 'Productivity Stats', path: '/analytics', icon: BarChart3 },
    { name: 'SaaS Profile', path: '/profile', icon: User },
  ];

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: '-100%', opacity: 0 }
  };

  const SidebarContent = () => (
    <div className="w-64 h-full bg-dark-900/90 backdrop-blur-xl border-r border-white/5 flex flex-col p-6 z-50">
      
      {/* Brand Header */}
      <div className="flex items-center justify-between mb-10 mt-2">
        <NavLink to="/" className="group">
          <Logo showText={true} className="w-10 h-10" />
        </NavLink>
        
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 lg:hidden"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Menu Links */}
      <nav className="flex-1 space-y-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className={({ isActive }) => `
                flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all group relative
                ${isActive 
                  ? 'text-white bg-indigo-600/10 border-l-4 border-indigo-500 shadow-inner' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 transition-transform group-hover:scale-105 ${isActive ? 'text-indigo-400' : 'text-gray-400 group-hover:text-gray-200'}`} />
                  <span>{item.name}</span>
                  {isActive && (
                    <span className="absolute right-3 w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Branding */}
      <div className="pt-6 border-t border-white/5 text-center">
        <span className="text-xs text-gray-600 font-medium">AuraTask v1.0.0</span>
        <p className="text-[10px] text-gray-500 mt-1">Next-Gen SDE Productivity Suite</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer (Portal Overlay) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            
            {/* Slide drawer */}
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={sidebarVariants}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
