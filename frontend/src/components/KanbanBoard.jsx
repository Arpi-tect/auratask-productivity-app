import React from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Clock, 
  MessageSquare, 
  Paperclip, 
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import GlassCard from './GlassCard';
import { 
  formatDate, 
  getPriorityBadge, 
  getCategoryStyle, 
  calculateProgress,
  isOverdue 
} from '../utils/helpers';

const KanbanBoard = ({ tasks, onStatusChange, onCreateTaskClick, onTaskClick }) => {
  const columns = [
    { id: 'todo', name: 'To Do', color: 'border-t-indigo-500 bg-indigo-500/5' },
    { id: 'in_progress', name: 'In Progress', color: 'border-t-purple-500 bg-purple-500/5' },
    { id: 'completed', name: 'Completed', color: 'border-t-emerald-500 bg-emerald-500/5' },
  ];

  // Drag and Drop implementation
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, status) => {
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      onStatusChange(taskId, status);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {columns.map((column) => {
        const columnTasks = tasks.filter((t) => t.status === column.id);

        return (
          <div
            key={column.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
            className="flex flex-col rounded-2xl bg-dark-800/20 border border-white/5 p-4 min-h-[500px]"
          >
            {/* Column Header */}
            <div className={`border-t-4 ${column.color} rounded-t-lg p-3 flex items-center justify-between mb-4`}>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-200">{column.name}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-gray-400">
                  {columnTasks.length}
                </span>
              </div>
              {column.id === 'todo' && (
                <button
                  onClick={onCreateTaskClick}
                  className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Tasks Container */}
            <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[600px] pr-1">
              {columnTasks.length === 0 ? (
                <div className="flex-1 border-2 border-dashed border-white/5 rounded-xl flex flex-col items-center justify-center p-6 text-center text-gray-600">
                  <span className="text-xs">Drag tasks here</span>
                </div>
              ) : (
                columnTasks.map((task) => {
                  const progress = calculateProgress(task.subtasks);
                  const isTaskOverdue = isOverdue(task.dueDate, task.status);

                  return (
                    <motion.div
                      key={task._id}
                      layoutId={task._id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task._id)}
                      onClick={() => onTaskClick(task)}
                      className="cursor-grab active:cursor-grabbing"
                    >
                      <GlassCard
                        className="p-4 border-l-4 border-l-indigo-500/20 hover:border-l-indigo-500 transition-all cursor-pointer select-none bg-dark-800/40 relative hover:bg-dark-800/60"
                        hover
                      >
                        {/* Tags / Badges row */}
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${getCategoryStyle(task.category)}`}>
                            {task.category}
                          </span>
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${getPriorityBadge(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="font-semibold text-gray-200 text-sm line-clamp-1 mb-1">
                          {task.title}
                        </h4>

                        {/* Description */}
                        {task.description && (
                          <p className="text-xs text-gray-400 line-clamp-2 mb-3">
                            {task.description}
                          </p>
                        )}

                        {/* Checklist progress */}
                        {task.subtasks && task.subtasks.length > 0 && (
                          <div className="space-y-1 mb-3">
                            <div className="flex justify-between text-[10px] text-gray-500">
                              <span>Checklist progress</span>
                              <span>{progress}%</span>
                            </div>
                            <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Footer details (Due Date, comments, files, status actions) */}
                        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-gray-500">
                          <div className="flex items-center gap-2">
                            <span className={`flex items-center gap-1 ${isTaskOverdue ? 'text-red-400 font-medium' : ''}`}>
                              {isTaskOverdue && <AlertCircle className="w-3.5 h-3.5 text-red-400" />}
                              <Clock className="w-3.5 h-3.5" />
                              {formatDate(task.dueDate)}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            {task.comments && task.comments.length > 0 && (
                              <span className="flex items-center gap-0.5">
                                <MessageSquare className="w-3 h-3" />
                                {task.comments.length}
                              </span>
                            )}
                            {task.pomodorosSpent > 0 && (
                              <span className="flex items-center gap-0.5 text-orange-400 font-bold" title="Focus sessions completed">
                                🍅 {task.pomodorosSpent}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Manual Status Advance Helper for Mobile Viewports */}
                        <div className="mt-3 pt-2 border-t border-white/5 flex justify-end gap-1.5 opacity-0 hover:opacity-100 transition-opacity">
                          {column.id !== 'completed' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const nextStatus = column.id === 'todo' ? 'in_progress' : 'completed';
                                onStatusChange(task._id, nextStatus);
                              }}
                              className="px-2 py-1 rounded bg-white/5 hover:bg-indigo-600/20 text-indigo-400 flex items-center gap-1 font-semibold text-[10px] transition-colors"
                              title="Move status forward"
                            >
                              <span>Next</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </GlassCard>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
