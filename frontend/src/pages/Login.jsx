import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, Sparkles, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);
    const success = await login(email, password);
    setIsSubmitting(false);

    if (success) {
      navigate('/');
    }
  };

  const handleDemoLogin = async () => {
    setIsSubmitting(true);
    // Use dummy email that triggers the demo fallback login in AuthContext
    const success = await login('demo@aura.dev', 'demomode123');
    setIsSubmitting(false);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 overflow-hidden bg-dark-900">
      
      {/* Background visual blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-glow-primary animate-blob" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-glow-secondary animate-blob animation-delay-2000" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md z-10"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 mb-3">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold font-display bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-indigo-300">
            Welcome to AuraTask
          </h2>
          <p className="text-gray-500 text-sm mt-1.5">Your next-generation productivity hub</p>
        </div>

        <GlassCard className="p-8 border border-white/5 bg-dark-900/60 shadow-2xl relative">
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email field */}
            <div className="space-y-2">
              <label className="text-xs uppercase font-bold tracking-wider text-gray-400">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.mercer@aura.dev"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 focus:border-indigo-500 focus:bg-white/[0.08] focus:outline-none text-sm text-gray-200 placeholder-gray-600 transition-all"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase font-bold tracking-wider text-gray-400">
                  Password
                </label>
                <Link to="#" className="text-xs text-indigo-400 hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 focus:border-indigo-500 focus:bg-white/[0.08] focus:outline-none text-sm text-gray-200 placeholder-gray-600 transition-all"
                />
              </div>
            </div>

            {/* Remember me toggle */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded accent-indigo-500 cursor-pointer bg-white/5 border-white/10"
              />
              <label htmlFor="remember" className="text-xs text-gray-400 cursor-pointer select-none">
                Remember my login session
              </label>
            </div>

            {/* Standard Login Trigger */}
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/15 hover:shadow-indigo-500/25 hover:translate-y-[-1px] transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Verifying credentials...' : (
                <>
                  <LogIn className="w-4.5 h-4.5" />
                  Sign In to Dashboard
                </>
              )}
            </button>
          </form>

          {/* Quick Recruiter Demo Login option */}
          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-white/5"></div>
            <span className="flex-shrink mx-4 text-gray-600 text-[10px] font-bold uppercase tracking-widest">or showcase</span>
            <div className="flex-grow border-t border-white/5"></div>
          </div>

          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 hover:from-indigo-500/15 hover:via-purple-500/15 hover:to-pink-500/15 text-indigo-300 border border-indigo-500/25 font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all hover:border-indigo-500/40"
          >
            <Sparkles className="w-4.5 h-4.5 text-indigo-400 fill-indigo-400/20" />
            Recruiter Quick Demo Login
          </button>

          {/* Navigational Footer */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500">
              New to AuraTask?{' '}
              <Link to="/register" className="text-indigo-400 hover:underline font-semibold ml-1">
                Create an account
              </Link>
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default Login;
