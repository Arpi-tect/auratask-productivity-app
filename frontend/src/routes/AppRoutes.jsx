import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Import Pages
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Tasks from '../pages/Tasks';
import Pomodoro from '../pages/Pomodoro';
import Analytics from '../pages/Analytics';
import Profile from '../pages/Profile';

// Import Layouts
import DashboardLayout from '../layouts/DashboardLayout';

/**
 * Protected Route gatekeeper
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-dark-900 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-t-2 border-indigo-500 rounded-full animate-spin" />
        <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Loading Aura Session...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

/**
 * Centered Application Router
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Gates */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Workspace Channels */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="pomodoro" element={<Pomodoro />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
