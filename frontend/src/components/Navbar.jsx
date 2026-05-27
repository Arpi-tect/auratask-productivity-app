import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Flame, Bell, LogOut, Menu, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = ({ onMenuToggle, pageTitle = "Dashboard" }) => {
  const { user, logout, isDemoMode } = useAuth();

  return (
    <header className="w-full bg-dark-900/40 backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-8 flex items-center justify-between sticky top-0 z-40">
      
      {/* Mobile Toggle & Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="p-2 text-gray-400 hover:text-white transition-colors lg:hidden rounded-xl hover:bg-white/5"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <h1 className="text-xl md:text-2xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-indigo-300">
          {pageTitle}
        </h1>
        
        {isDemoMode && (
          <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Showcase Demo Mode
          </span>
        )}
      </div>

      {/* Profile and Stats Actions */}
      <div className="flex items-center gap-3 md:gap-6">
        
        {/* Streak Counter */}
        {user && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-orange-500/10 to-red-500/10 text-orange-400 border border-orange-500/20 rounded-full cursor-pointer hover:from-orange-500/15 hover:to-red-500/15 transition-all"
            title="Current Consecutive Activity Streak"
          >
            <Flame className="w-4 h-4 fill-orange-500/20 animate-pulse" />
            <span className="text-sm font-bold">{user.streakCurrent || 0} Day Streak</span>
          </motion.div>
        )}

        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors hidden sm:block">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-dark-900" />
        </button>

        {/* User Card */}
        {user && (
          <div className="flex items-center gap-3 border-l border-white/10 pl-3 md:pl-6">
            <div className="flex flex-col text-right hidden sm:flex">
              <span className="text-sm font-semibold text-gray-200">{user.name}</span>
              <span className="text-xs text-gray-500 truncate max-w-[120px]">{user.email}</span>
            </div>
            
            <div className="relative group cursor-pointer">
              {user.avatar ? (
                <img
                  src={user.avatar.startsWith('/uploads') ? `http://localhost:5000${user.avatar}` : user.avatar}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover border border-indigo-500/30"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white border border-indigo-500/30">
                  {user.name.charAt(0)}
                </div>
              )}
            </div>

            <button
              onClick={logout}
              className="p-2 text-gray-400 hover:text-red-400 rounded-xl hover:bg-white/5 transition-all"
              title="Log Out Session"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
