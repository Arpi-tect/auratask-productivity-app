import React, { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import GlassCard from '../components/GlassCard';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '../animations';
import { getCategoryStyle, formatDate } from '../utils/helpers';

const CalendarView = () => {
  const { tasks, loading } = useTasks();
  const [currentDate, setCurrentDate] = useState(new Date());

  // Navigation helpers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Map tasks to dates
  const getTasksForDay = (day) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const dueDateObj = new Date(task.dueDate);
      return dueDateObj.getDate() === day && 
             dueDateObj.getMonth() === month && 
             dueDateObj.getFullYear() === year;
    });
  };

  // Generate blank calendar boxes preceding the 1st of the month
  const calendarCells = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push(<div key={`empty-${i}`} className="min-h-[90px] border border-white/5 bg-white/[0.01] opacity-20 rounded-xl" />);
  }

  // Generate active calendar date grids
  for (let day = 1; day <= daysInMonth; day++) {
    const dayTasks = getTasksForDay(day);
    const isToday = new Date().getDate() === day && 
                    new Date().getMonth() === month && 
                    new Date().getFullYear() === year;

    calendarCells.push(
      <div 
        key={`day-${day}`}
        className={`min-h-[100px] border p-2.5 rounded-2xl flex flex-col gap-1.5 transition-all ${
          isToday 
            ? 'bg-indigo-600/5 border-indigo-500 shadow-lg shadow-indigo-500/5' 
            : 'bg-dark-800/20 border-white/5 hover:border-white/10 hover:bg-dark-800/30'
        }`}
      >
        <span className={`text-xs font-bold ${isToday ? 'text-indigo-400' : 'text-gray-400'}`}>
          {day}
        </span>
        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          {dayTasks.map(task => (
            <div 
              key={task._id}
              className={`p-1 px-1.5 rounded text-[9px] font-semibold line-clamp-1 border ${getCategoryStyle(task.category)}`}
              title={task.title}
            >
              {task.title}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="p-6 md:p-8 space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white">Timeline Schedule</h2>
          <p className="text-xs text-gray-500 mt-1">Calendar tracking for your active due dates and delivery sprints</p>
        </div>

        {/* Date navigators */}
        <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-xl p-1.5 text-gray-400">
          <button 
            onClick={handlePrevMonth}
            className="p-1.5 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="text-xs font-bold text-gray-300 w-36 text-center select-none">
            {monthNames[month]} {year}
          </span>

          <button 
            onClick={handleNextMonth}
            className="p-1.5 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="w-full h-96 bg-white/5 rounded-2xl animate-pulse" />
      ) : (
        <div className="space-y-4">
          
          {/* Calendar Weekday headers */}
          <div className="grid grid-cols-7 gap-3 text-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Calendar Days Matrix */}
          <div className="grid grid-cols-7 gap-3">
            {calendarCells}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CalendarView;
