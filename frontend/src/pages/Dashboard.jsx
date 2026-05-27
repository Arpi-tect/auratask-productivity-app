import React, { useEffect, useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import { 
  CheckCircle, 
  Clock, 
  Flame, 
  Sparkles, 
  BookOpen, 
  Calendar,
  AlertTriangle,
  TrendingUp,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';
import { staggerContainer, scaleUp, fadeIn } from '../animations';

const Dashboard = () => {
  const { user } = useAuth();
  const { 
    tasks, 
    loading, 
    analytics, 
    aiSuggestions, 
    fetchAnalytics, 
    fetchAISuggestions,
    createTask
  } = useTasks();

  const [newQuickTaskTitle, setNewQuickTaskTitle] = useState('');

  // Pull calculations when mounting
  useEffect(() => {
    fetchAnalytics();
    fetchAISuggestions();
  }, [tasks, fetchAnalytics, fetchAISuggestions]);

  const handleQuickTaskSubmit = async (e) => {
    e.preventDefault();
    if (!newQuickTaskTitle.trim()) return;

    const taskData = {
      title: newQuickTaskTitle,
      description: 'Quick task drafted from Dashboard.',
      priority: 'medium',
      category: 'Work',
      status: 'todo',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    const success = await createTask(taskData);
    if (success) {
      setNewQuickTaskTitle('');
    }
  };

  const stats = analytics?.stats || {
    total: 0,
    completed: 0,
    inProgress: 0,
    completionRate: 0,
    totalPomodoros: 0,
    productivityScore: 50,
    overdueCount: 0,
    dailyGoal: 3
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8 p-6 md:p-8"
    >
      {/* Welcome Hero row */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Hey, {user?.name.split(' ')[0]}! 👋
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {stats.completionRate >= 80 
              ? "You're having a brilliant productivity streak! Keep crushing it." 
              : "Review your priority queue below and kick off a focus Pomodoro."}
          </p>
        </div>

        {/* Quick Goal tracker */}
        <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 rounded-2xl p-3 px-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Today's Goal</div>
            <div className="text-sm font-bold text-gray-200">
              {stats.completed} / {user?.dailyGoal || stats.dailyGoal} Completed
            </div>
          </div>
        </div>
      </div>

      {/* Main Metrics grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Tasks */}
        <GlassCard animate hover className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-white block">{stats.total}</span>
            <span className="text-xs text-gray-500 font-medium">Total Registered Tasks</span>
          </div>
        </GlassCard>

        {/* Completion Rate */}
        <GlassCard animate hover className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-white block">{stats.completionRate}%</span>
            <span className="text-xs text-gray-500 font-medium">Completion Ratio</span>
          </div>
        </GlassCard>

        {/* Pomodoros focused */}
        <GlassCard animate hover className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400 text-lg">
            🍅
          </div>
          <div>
            <span className="text-2xl font-bold text-white block">{stats.totalPomodoros}</span>
            <span className="text-xs text-gray-500 font-medium">Focus Sessions Completed</span>
          </div>
        </GlassCard>

        {/* Productivity Score */}
        <GlassCard animate hover className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-white block">{stats.productivityScore}</span>
            <span className="text-xs text-gray-500 font-medium">Smart productivity Score</span>
          </div>
        </GlassCard>
      </div>

      {/* AI Assistant Suggestions Column & Schedule UI */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* AI Recommendations panel */}
        <div className="xl:col-span-2 space-y-6">
          <GlassCard animate className="border border-indigo-500/10 bg-indigo-950/5 relative">
            <div className="absolute top-4 right-4 w-24 h-24 bg-glow-primary rounded-full pointer-events-none" />
            
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse fill-indigo-400/20" />
              <h3 className="text-lg font-bold text-gray-200">Aura AI Recommendations</h3>
            </div>

            {aiSuggestions?.warnings && aiSuggestions.warnings.length > 0 && (
              <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-3 text-red-400 text-xs">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <div>
                  <span className="font-bold block mb-1">Critical Warning</span>
                  <span>{aiSuggestions.warnings[0].message}</span>
                </div>
              </div>
            )}

            {/* Smart Suggestions List */}
            <div className="space-y-4">
              {aiSuggestions?.suggestions && aiSuggestions.suggestions.map((sug, idx) => (
                <div 
                  key={idx} 
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-white/[0.04] transition-all"
                >
                  <div>
                    <h4 className="font-bold text-sm text-gray-200">{sug.title}</h4>
                    <p className="text-xs text-gray-400 mt-1">{sug.description}</p>
                  </div>
                  <span className="px-3 py-1.5 rounded-lg bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 text-xs font-semibold cursor-pointer border border-indigo-500/25 transition-all">
                    {sug.action}
                  </span>
                </div>
              ))}

              {(!aiSuggestions?.suggestions || aiSuggestions.suggestions.length === 0) && (
                <p className="text-xs text-gray-500 italic">No recommendations right now. Keep planning ahead!</p>
              )}
            </div>

            {/* Auto-suggested daily tip block */}
            <div className="mt-6 pt-5 border-t border-white/5 flex gap-3 text-xs text-gray-400">
              <BookOpen className="w-5 h-5 text-indigo-400 shrink-0" />
              <div>
                <span className="font-bold block text-gray-300">Smart Productivity Tip:</span>
                <p className="mt-1 italic">"{aiSuggestions?.tip || 'Establish deep work focus blocks by splitting items into clear 20-minute subtasks.'}"</p>
              </div>
            </div>
          </GlassCard>

          {/* Quick-Add Draft Task */}
          <GlassCard animate>
            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4">Quick Draft Task</h3>
            <form onSubmit={handleQuickTaskSubmit} className="flex gap-3">
              <input
                type="text"
                value={newQuickTaskTitle}
                onChange={(e) => setNewQuickTaskTitle(e.target.value)}
                placeholder="e.g. Finish writing API unit test suite..."
                required
                className="flex-1 rounded-xl bg-white/5 border border-white/5 focus:border-indigo-500 focus:outline-none text-xs text-gray-200 px-4 py-3 placeholder-gray-600"
              />
              <button
                type="submit"
                className="py-3 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/15"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </form>
          </GlassCard>
        </div>

        {/* AI Suggested Daily Schedule */}
        <div className="space-y-6">
          <GlassCard animate>
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-bold text-gray-200">AI Suggested Schedule</h3>
            </div>

            <div className="space-y-5">
              {aiSuggestions?.schedule && aiSuggestions.schedule.map((item, idx) => (
                <div key={idx} className="relative pl-6 border-l-2 border-indigo-500/30 space-y-1">
                  <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <div className="flex justify-between text-[11px] font-bold text-gray-500">
                    <span>{item.time} ({item.duration})</span>
                  </div>
                  <h4 className="font-semibold text-xs text-gray-200">{item.taskTitle}</h4>
                  <p className="text-[10px] text-gray-500 italic">{item.activity}</p>
                </div>
              ))}

              {(!aiSuggestions?.schedule || aiSuggestions.schedule.length === 0) && (
                <div className="text-center p-6 text-xs text-gray-600 border border-dashed border-white/5 rounded-xl">
                  Add some high priority tasks to see a suggested daily schedule here.
                </div>
              )}
            </div>
          </GlassCard>

          {/* User Streaks Card */}
          {user && (
            <GlassCard animate className="bg-gradient-to-tr from-orange-500/5 to-red-500/5 border-orange-500/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500 fill-orange-500/20" />
                  <span className="font-bold text-gray-200">Milestones</span>
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  Streak Active
                </span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-3xl font-extrabold text-white block">{user.streakCurrent || 0}</span>
                  <span className="text-xs text-gray-500">Current consecutive days active</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-gray-300 block">{user.streakLongest || 0}</span>
                  <span className="text-[10px] text-gray-600">Longest Streak record</span>
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
