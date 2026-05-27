import React, { useEffect } from 'react';
import { useTasks } from '../hooks/useTasks';
import GlassCard from '../components/GlassCard';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar
} from 'recharts';
import { BarChart3, TrendingUp, Sparkles, CheckCircle2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { staggerContainer } from '../animations';

const Analytics = () => {
  const { analytics, fetchAnalytics } = useTasks();

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const stats = analytics?.stats || {
    total: 0,
    completed: 0,
    completionRate: 0,
    totalPomodoros: 0,
    productivityScore: 50
  };

  const categoryData = analytics?.categoryData || [];
  const activityData = analytics?.activityData || [];
  const priorityCounts = analytics?.priorityCounts || { low: 0, medium: 0, high: 0 };

  const priorityChartData = [
    { name: 'Low', count: priorityCounts.low, fill: '#60a5fa' },
    { name: 'Medium', count: priorityCounts.medium, fill: '#fbbf24' },
    { name: 'High', count: priorityCounts.high, fill: '#f87171' }
  ];

  // Pie Chart Custom Colors
  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="p-6 md:p-8 space-y-8"
    >
      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-white">Productivity Analytics</h2>
        <p className="text-xs text-gray-500 mt-1">Deep insight analytics covering task completion velocity and sprint allocation</p>
      </div>

      {/* Numerical cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="flex items-center gap-4 border border-brand-primary/10">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-white block">{stats.completionRate}%</span>
            <span className="text-xs text-gray-500 font-medium">Sprint Completion Rate</span>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-4 border border-purple-500/10">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-white block">{stats.productivityScore} / 100</span>
            <span className="text-xs text-gray-500 font-medium">Sprint Productivity Score</span>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-4 border border-orange-500/10">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400 text-lg">
            🍅
          </div>
          <div>
            <span className="text-2xl font-extrabold text-white block">{stats.totalPomodoros}</span>
            <span className="text-xs text-gray-500 font-medium">Deep Focus Sessions Completed</span>
          </div>
        </GlassCard>
      </div>

      {/* Recharts Area Chart - Task Velocity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Completion Area Chart */}
        <GlassCard className="xl:col-span-2 space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              Completion Velocity (Past 14 Days)
            </h3>
          </div>

          <div className="w-full h-72 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompletions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="formattedDate" stroke="#4b5563" />
                <YAxis stroke="#4b5563" allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(17, 24, 39, 0.95)', 
                    borderColor: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    color: '#e5e7eb'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#6366f1" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorCompletions)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Priority Counts Chart */}
        <GlassCard className="space-y-4">
          <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Priority Sprints Allocation</h3>
          <div className="w-full h-72 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#4b5563" />
                <YAxis stroke="#4b5563" allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    borderColor: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    color: '#e5e7eb'
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {priorityChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Row for category splits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Category distribution Pie Chart */}
        <GlassCard className="space-y-4">
          <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Sprint Categories distribution</h3>
          <div className="w-full h-64 text-xs flex justify-center items-center">
            {categoryData.length === 0 ? (
              <p className="text-xs text-gray-500 italic">No tasks created. Add categories to see distributions.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(17, 24, 39, 0.95)', 
                      borderColor: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '12px',
                      color: '#e5e7eb'
                    }} 
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </GlassCard>

        {/* AI Insight report */}
        <GlassCard className="border border-indigo-500/10 bg-indigo-950/5 relative overflow-hidden flex flex-col justify-center">
          <div className="absolute top-0 right-0 w-32 h-32 bg-glow-primary rounded-full pointer-events-none" />
          <div className="relative z-10 p-2 space-y-4">
            <div className="flex items-center gap-2 text-indigo-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <h3 className="text-lg font-bold text-gray-200">Aura Productivity Insights</h3>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Based on your task velocity charts, you complete items with the highest velocity mid-week. Consider scheduling high-effort "Development" tasks on Tuesdays and Wednesdays, and reserve Fridays for roadmapping and checklist reviews.
            </p>
            <div className="pt-2 flex items-center gap-2.5 text-xs font-bold text-indigo-300">
              <span>Goal Efficiency:</span>
              <span className="bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded text-[10px]">
                {stats.completionRate >= 60 ? 'Optimal Sprint' : 'Growing Velocity'}
              </span>
            </div>
          </div>
        </GlassCard>
      </div>

    </motion.div>
  );
};

export default Analytics;
