import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/api';
import { sampleUser } from '../data/sampleData';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const data = await authAPI.getMe();
          if (data?.success) {
            setUser(data.user);
            setIsDemoMode(false);
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.warn('[AuthContext] API connection failed. Booting in portfolio showcase demo mode.');
          // Graceful fallback to demo mode
          setUser(sampleUser);
          setIsDemoMode(true);
        }
      } else {
        // Option to boot immediately into demo mode for public showcase if desired
        setUser(null);
      }
      setLoading(false);
    };

    checkLoginStatus();
  }, []);

  // Login handler
  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const data = await authAPI.login({ email, password });
      if (data?.success) {
        setUser(data.user);
        setIsDemoMode(false);
        toast.success(`Welcome back, ${data.user.name}!`);
        return true;
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed. Checking credentials...';
      
      // Fallback behavior: let user log in with dummy credentials for easy recruiter tests!
      if (email === 'demo@aura.dev' || email === 'alex.mercer@aura.dev') {
        setUser(sampleUser);
        setIsDemoMode(true);
        localStorage.setItem('token', 'mock_token_demo_mode');
        toast.success('Successfully entered in Portfolio Demo Mode!');
        setLoading(false);
        return true;
      }

      toast.error(errorMsg);
      console.error(error);
    }
    setLoading(false);
    return false;
  };

  // Register handler
  const registerUser = async (name, email, password) => {
    setLoading(true);
    try {
      const data = await authAPI.register({ name, email, password });
      if (data?.success) {
        setUser(data.user);
        setIsDemoMode(false);
        toast.success(`Account created! Welcome ${name}`);
        return true;
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Registration failed.';
      toast.error(errorMsg);
      console.error(error);
    }
    setLoading(false);
    return false;
  };

  // Logout handler
  const logoutUser = () => {
    authAPI.logout();
    setUser(null);
    setIsDemoMode(false);
    localStorage.removeItem('token');
    toast.success('Logged out successfully.');
  };

  // Update profile handler
  const updateProfile = async (name, dailyGoal) => {
    try {
      if (isDemoMode) {
        setUser(prev => ({ ...prev, name, dailyGoal }));
        toast.success('Profile updated (Demo Mode)');
        return true;
      }
      const data = await authAPI.updateProfile({ name, dailyGoal });
      if (data?.success) {
        setUser(data.user);
        toast.success('Profile updated successfully!');
        return true;
      }
    } catch (error) {
      toast.error('Failed to update profile.');
    }
    return false;
  };

  // Update avatar handler
  const updateAvatar = async (formData) => {
    try {
      if (isDemoMode) {
        toast.success('Avatar upload mock successful!');
        return true;
      }
      const data = await authAPI.uploadAvatar(formData);
      if (data?.success) {
        setUser(prev => ({ ...prev, avatar: data.avatar }));
        toast.success('Profile image updated!');
        return true;
      }
    } catch (error) {
      toast.error('Failed to upload image.');
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isDemoMode,
        login: loginUser,
        register: registerUser,
        logout: logoutUser,
        updateProfile,
        updateAvatar,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
