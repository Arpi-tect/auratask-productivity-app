import React from 'react';
import { useTasks } from '../hooks/useTasks';
import PomodoroTimer from '../components/PomodoroTimer';
import GlassCard from '../components/GlassCard';
import { Timer, Zap, ShieldAlert, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeIn } from '../animations';

const Pomodoro = () => {
  const { tasks, logPomodoro } = useTasks();

  const handleFocusSessionCompleted = async (taskId) => {
    if (taskId) {
      await logPomodoro(taskId);
    }
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="p-6 md:p-8 space-y-8"
    >
      {/* Page Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-white">Focus Pomodoro Space</h2>
        <p className="text-xs text-gray-500 mt-1">Block out notifications, associate a task, and initiate deep focus sprints</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Circular Focus clock component */}
        <div className="lg:col-span-2">
          <PomodoroTimer 
            tasks={tasks} 
            onFocusSessionCompleted={handleFocusSessionCompleted} 
          />
        </div>

        {/* Informative Side Cards */}
        <div className="space-y-6">
          {/* Motivation Quote */}
          <GlassCard className="relative overflow-hidden border border-brand-primary/10 bg-brand-primary/5">
            <Zap className="w-8 h-8 text-indigo-400 mb-3" />
            <h4 className="font-bold text-sm text-gray-200">The Power of Deep Focus</h4>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              "Focus is a muscle, and the Pomodoro method is your gym. By keeping focus narrow and scheduling periodic break slots, you keep mental stress minimal and output peak."
            </p>
          </GlassCard>

          {/* Badges milestones */}
          <GlassCard className="space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Award className="w-5 h-5 text-purple-400" />
              <h4 className="font-bold text-sm text-gray-200">Focus Milestones</h4>
            </div>

            <div className="space-y-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Focus Rookie badge</span>
                <span className="text-indigo-400 font-bold">1 Session</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Pomodoro Master badge</span>
                <span className="text-indigo-400 font-bold">5 Sessions</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Focus Wizard badge</span>
                <span className="text-indigo-400 font-bold">20 Sessions</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
};

export default Pomodoro;
