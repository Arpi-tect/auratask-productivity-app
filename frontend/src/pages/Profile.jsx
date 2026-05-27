import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import { User, Flame, Award, Camera, Settings, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { staggerContainer, scaleUp } from '../animations';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile, updateAvatar, isDemoMode } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [dailyGoal, setDailyGoal] = useState(user?.dailyGoal || 3);
  const [isUpdating, setIsUpdating] = useState(false);

  // Available Achievement Badges Setup
  const availableBadges = [
    { name: 'Streak Starter', desc: 'Maintain an active streak for 1 day', icon: '🔥', tier: 'Bronze' },
    { name: 'Consistent', desc: 'Reach a consecutive 3-day streak', icon: '⚡', tier: 'Silver' },
    { name: 'Deep Work Champ', desc: 'Complete 1 Pomodoro focus session', icon: '🍅', tier: 'Gold' },
    { name: 'Focus Rookie', desc: 'Maintain a 5-day active streak', icon: '🎯', tier: 'Bronze' },
    { name: 'Pomodoro Master', desc: 'Achieve 5 focus session logs', icon: '👑', tier: 'Silver' },
    { name: 'Unstoppable', desc: 'Unlock more than 3 distinct milestones', icon: '🚀', tier: 'Gold' }
  ];

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const success = await updateProfile(name, parseInt(dailyGoal));
    setIsUpdating(false);
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (isDemoMode) {
      toast.success('Avatar mock-upload successful (Demo Mode)!');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    setIsUpdating(true);
    await updateAvatar(formData);
    setIsUpdating(false);
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="p-6 md:p-8 space-y-8"
    >
      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-white">SaaS Profile Settings</h2>
        <p className="text-xs text-gray-500 mt-1">Adjust your daily completion objectives and manage focus milestones</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Info & Avatar column */}
        <div className="lg:col-span-1 space-y-6">
          <GlassCard className="flex flex-col items-center p-8 text-center relative">
            
            {/* Avatar container */}
            <div className="relative w-28 h-28 mb-5 group cursor-pointer">
              {user?.avatar ? (
                <img
                  src={user.avatar.startsWith('/uploads') ? `http://localhost:5000${user.avatar}` : user.avatar}
                  alt={user?.name}
                  className="w-full h-full rounded-full object-cover border-2 border-indigo-500/30"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white border-2 border-indigo-500/30">
                  {user?.name.charAt(0)}
                </div>
              )}
              
              <label 
                htmlFor="avatar-file"
                className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border border-white/10"
              >
                <Camera className="w-6 h-6 text-white" />
              </label>
              <input
                type="file"
                id="avatar-file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            <h3 className="text-lg font-bold text-gray-200">{user?.name}</h3>
            <span className="text-xs text-gray-500 mt-1 block">{user?.email}</span>

            {/* Streak count details inside profile */}
            <div className="w-full grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-white/5 text-xs">
              <div className="text-left bg-white/[0.01] border border-white/5 p-3 rounded-xl">
                <span className="text-gray-500 text-[10px] uppercase font-bold block">Current Streak</span>
                <span className="text-lg font-bold text-orange-400 mt-1 block">🔥 {user?.streakCurrent || 0} Days</span>
              </div>
              <div className="text-left bg-white/[0.01] border border-white/5 p-3 rounded-xl">
                <span className="text-gray-500 text-[10px] uppercase font-bold block">Longest Record</span>
                <span className="text-lg font-bold text-gray-300 mt-1 block">⭐ {user?.streakLongest || 0} Days</span>
              </div>
            </div>
          </GlassCard>

          {/* Configuration Form card */}
          <GlassCard>
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-5 flex items-center gap-1.5">
              <Settings className="w-4 h-4 text-gray-500" />
              Sprint Parameters
            </h4>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">SDE Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Change profile name..."
                  required
                  className="w-full rounded-xl bg-white/5 border border-white/5 focus:border-indigo-500 focus:outline-none text-xs text-gray-200 px-3 py-2.5"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Daily Task Target</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={dailyGoal}
                  onChange={(e) => setDailyGoal(e.target.value)}
                  required
                  className="w-full rounded-xl bg-white/5 border border-white/5 focus:border-indigo-500 focus:outline-none text-xs text-gray-200 px-3 py-2.5"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition-all shadow-md"
              >
                {isUpdating ? 'Saving config...' : 'Update Settings'}
              </button>
            </form>
          </GlassCard>
        </div>

        {/* Badges and Achievements Center */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard>
            <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-6">
              <Award className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-bold text-gray-200">Aura Badges & Achievements</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableBadges.map((badge, idx) => {
                // Check if user has unlocked this badge (match by name)
                const isUnlocked = user?.badges?.some(b => b.toLowerCase().includes(badge.name.toLowerCase())) || false;

                return (
                  <motion.div
                    key={idx}
                    variants={scaleUp}
                    className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${
                      isUnlocked 
                        ? 'bg-indigo-500/5 border-indigo-500/25 shadow-lg shadow-indigo-500/5' 
                        : 'bg-white/[0.01] border-white/5 opacity-55 hover:opacity-75'
                    }`}
                  >
                    {/* Badge Icon circle */}
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border ${
                      isUnlocked 
                        ? 'bg-indigo-500/10 border-indigo-500/20 text-glow animate-pulse-slow' 
                        : 'bg-white/5 border-white/5'
                    }`}>
                      {badge.icon}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-gray-200">{badge.name}</h4>
                        {isUnlocked ? (
                          <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Unlocked
                          </span>
                        ) : (
                          <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-white/5 text-gray-500">
                            Locked
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1 leading-normal">{badge.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
