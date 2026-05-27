import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, UserPlus, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import Logo from '../components/Logo';

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    setIsSubmitting(true);
    const success = await register(name, email, password);
    setIsSubmitting(false);

    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 overflow-hidden bg-dark-900">
      
      {/* Background Visual Blobs */}
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
          <Logo showText={true} className="w-16 h-16 mb-2" />
        </div>

        <GlassCard className="p-8 border border-white/5 bg-dark-900/60 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Full Name field */}
            <div className="space-y-2">
              <label className="text-xs uppercase font-bold tracking-wider text-gray-400">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Mercer"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 focus:border-indigo-500 focus:bg-white/[0.08] focus:outline-none text-sm text-gray-200 placeholder-gray-600 transition-all"
                />
              </div>
            </div>

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
              <label className="text-xs uppercase font-bold tracking-wider text-gray-400">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minlength="6"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 focus:border-indigo-500 focus:bg-white/[0.08] focus:outline-none text-sm text-gray-200 placeholder-gray-600 transition-all"
                />
              </div>
            </div>

            {/* Standard Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/15 hover:shadow-indigo-500/25 hover:translate-y-[-1px] transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Creating account...' : (
                <>
                  <UserPlus className="w-4.5 h-4.5" />
                  Sign Up & Get Started
                </>
              )}
            </button>
          </form>

          {/* Footer links */}
          <div className="text-center mt-6 border-t border-white/5 pt-4">
            <p className="text-xs text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-400 hover:underline font-semibold ml-1">
                Log in
              </Link>
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default Register;
