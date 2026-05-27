import React, { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import KanbanBoard from '../components/KanbanBoard';
import GlassCard from '../components/GlassCard';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  ChevronRight, 
  Trash2, 
  CheckSquare, 
  Square,
  X,
  MessageSquare,
  Clock,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { scaleUp } from '../animations';
import { getPriorityBadge, getCategoryStyle, formatDate, calculateProgress } from '../utils/helpers';

const Tasks = () => {
  const [viewMode, setViewMode] = useState('kanban'); // kanban | list
  
  // Search & Filter state variables
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Trigger tasks query hook
  const { 
    tasks, 
    loading, 
    createTask, 
    updateTask, 
    deleteTask, 
    addComment,
    logPomodoro 
  } = useTasks({
    search,
    status: statusFilter,
    priority: priorityFilter,
    category: categoryFilter,
    sortBy
  });

  // Modal open states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Form Field States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('Work');
  const [dueDate, setDueDate] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceInterval, setRecurrenceInterval] = useState('none');
  const [subtasksInput, setSubtasksInput] = useState([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  // Comment states
  const [commentText, setCommentText] = useState('');

  // Subtask Checklist Add
  const addSubtaskToInput = () => {
    if (!newSubtaskTitle.trim()) return;
    setSubtasksInput([...subtasksInput, { title: newSubtaskTitle, completed: false }]);
    setNewSubtaskTitle('');
  };

  const removeSubtaskFromInput = (index) => {
    setSubtasksInput(subtasksInput.filter((_, idx) => idx !== index));
  };

  // Submit new Task
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskData = {
      title,
      description,
      priority,
      category,
      dueDate: dueDate || null,
      isRecurring,
      recurrenceInterval: isRecurring ? recurrenceInterval : 'none',
      subtasks: subtasksInput,
      status: 'todo'
    };

    const success = await createTask(taskData);
    if (success) {
      setIsCreateModalOpen(false);
      resetCreateForm();
    }
  };

  const resetCreateForm = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setCategory('Work');
    setDueDate('');
    setIsRecurring(false);
    setRecurrenceInterval('none');
    setSubtasksInput([]);
    setNewSubtaskTitle('');
  };

  // Subtask checkbox toggling in Edit Modal
  const handleSubtaskToggle = async (task, subtaskId) => {
    const updatedSubtasks = task.subtasks.map(sub => {
      if (sub._id === subtaskId) {
        return { ...sub, completed: !sub.completed };
      }
      return sub;
    });

    const success = await updateTask(task._id, { subtasks: updatedSubtasks });
    if (success) {
      setSelectedTask(prev => ({ ...prev, subtasks: updatedSubtasks }));
    }
  };

  // Status Shift Trigger
  const handleStatusChange = async (taskId, newStatus) => {
    await updateTask(taskId, { status: newStatus });
  };

  // Add Comment Trigger
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const success = await addComment(selectedTask._id, commentText);
    if (success) {
      // Optimistic update local selectedTask
      setSelectedTask(prev => ({
        ...prev,
        comments: [...(prev.comments || []), { userName: "You", text: commentText, createdAt: new Date().toISOString() }]
      }));
      setCommentText('');
    }
  };

  // Delete Task Trigger
  const handleDeleteClick = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const success = await deleteTask(taskId);
      if (success) {
        setSelectedTask(null);
      }
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      
      {/* Header section with view filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white">Workflows & Tasks</h2>
          <p className="text-xs text-gray-500 mt-1">Organize your sprints, track checklists, and check Pomodoro times</p>
        </div>

        {/* View togglers and Add Trigger */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center bg-white/5 border border-white/5 rounded-xl p-1 text-gray-400">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'kanban' ? 'bg-indigo-600 text-white shadow-md' : 'hover:text-white'}`}
              title="Kanban Board Grid"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-indigo-600 text-white shadow-md' : 'hover:text-white'}`}
              title="Detailed Checklist List"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex-1 sm:flex-initial py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/15"
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>
      </div>

      {/* Filter and search bar row */}
      <GlassCard className="p-4 border border-white/5 bg-dark-900/40">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          
          {/* Search bar */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by keywords..."
              className="w-full rounded-xl bg-white/5 border border-white/5 focus:border-indigo-500 focus:outline-none text-xs text-gray-200 pl-10 pr-4 py-2.5"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl bg-white/5 border border-white/5 px-3 py-2.5 text-xs text-gray-400 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Categories</option>
            <option value="Work">Work</option>
            <option value="Development">Development</option>
            <option value="Design">Design</option>
            <option value="Database">Database</option>
            <option value="Marketing">Marketing</option>
            <option value="Personal">Personal</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-xl bg-white/5 border border-white/5 px-3 py-2.5 text-xs text-gray-400 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Priorities</option>
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>

          {/* Sort Selection */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl bg-white/5 border border-white/5 px-3 py-2.5 text-xs text-gray-400 focus:outline-none focus:border-indigo-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="dueDate">Due Date Priority</option>
          </select>
        </div>
      </GlassCard>

      {/* Main tasks listing content view */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="w-full h-24 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {viewMode === 'kanban' ? (
            <KanbanBoard
              tasks={tasks}
              onStatusChange={handleStatusChange}
              onCreateTaskClick={() => setIsCreateModalOpen(true)}
              onTaskClick={(task) => setSelectedTask(task)}
            />
          ) : (
            <div className="space-y-3.5">
              {tasks.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center p-6 text-gray-500">
                  <CheckCircle className="w-10 h-10 text-gray-600 mb-2" />
                  <p className="text-xs">No pending tasks match your active filters.</p>
                </div>
              ) : (
                tasks.map((task) => {
                  const progress = calculateProgress(task.subtasks);
                  return (
                    <GlassCard
                      key={task._id}
                      onClick={() => setSelectedTask(task)}
                      className="p-4 bg-dark-800/40 hover:bg-dark-800/60 border-l-4 border-l-brand-primary/20 hover:border-l-brand-primary cursor-pointer select-none transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                      hover
                    >
                      <div className="flex gap-4 items-center flex-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(task._id, task.status === 'completed' ? 'todo' : 'completed');
                          }}
                          className="text-gray-500 hover:text-indigo-400 transition-colors"
                        >
                          {task.status === 'completed' ? (
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <div className="w-5 h-5 border border-gray-600 rounded-md" />
                          )}
                        </button>

                        <div>
                          <h4 className={`font-semibold text-sm ${task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                            {task.title}
                          </h4>
                          <div className="flex flex-wrap gap-2.5 items-center mt-2.5 text-[11px] text-gray-500">
                            <span className={`px-2 py-0.5 rounded ${getCategoryStyle(task.category)}`}>{task.category}</span>
                            <span className={`px-2 py-0.5 rounded ${getPriorityBadge(task.priority)}`}>{task.priority}</span>
                            <span>• Due: {formatDate(task.dueDate)}</span>
                            {task.subtasks?.length > 0 && <span>• Checklist: {progress}%</span>}
                            {task.pomodorosSpent > 0 && <span className="text-orange-400 font-bold">🍅 {task.pomodorosSpent} focus sessions</span>}
                          </div>
                        </div>
                      </div>

                      <ChevronRight className="w-5 h-5 text-gray-600 self-center hidden md:block" />
                    </GlassCard>
                  );
                })
              )}
            </div>
          )}
        </>
      )}

      {/* RENDER CREATE TASK MODAL */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateModalOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />
            
            <motion.div
              variants={scaleUp}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="w-full max-w-xl bg-dark-900 border border-white/10 rounded-2xl p-6 md:p-8 z-10 shadow-2xl relative"
            >
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="absolute top-4 right-4 p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-gray-200 mb-6">Create Productivity Task</h3>
              
              <form onSubmit={handleCreateTask} className="space-y-4">
                
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Task Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Implementcompound MongoDB indexes"
                    required
                    className="w-full rounded-xl bg-white/5 border border-white/5 focus:border-indigo-500 focus:outline-none text-xs text-gray-200 px-3.5 py-3"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Draft task instructions and references..."
                    className="w-full rounded-xl bg-white/5 border border-white/5 focus:border-indigo-500 focus:outline-none text-xs text-gray-200 px-3.5 py-3 h-20 resize-none"
                  />
                </div>

                {/* Priority, Category, Due Date selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Priority</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full rounded-xl bg-white/5 border border-white/5 px-3 py-3 text-xs text-gray-400 focus:outline-none"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-xl bg-white/5 border border-white/5 px-3 py-3 text-xs text-gray-400 focus:outline-none"
                    >
                      <option value="Work">Work</option>
                      <option value="Development">Development</option>
                      <option value="Design">Design</option>
                      <option value="Database">Database</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Personal">Personal</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Due Date</label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full rounded-xl bg-white/5 border border-white/5 px-3 py-2.5 text-xs text-gray-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Subtasks checklists creator */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Add subtask items</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSubtaskTitle}
                      onChange={(e) => setNewSubtaskTitle(e.target.value)}
                      placeholder="Add subtask title..."
                      className="flex-1 rounded-xl bg-white/5 border border-white/5 focus:outline-none text-xs text-gray-300 px-3 py-2"
                    />
                    <button
                      type="button"
                      onClick={addSubtaskToInput}
                      className="px-4 py-2 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-xl text-xs font-bold transition-all"
                    >
                      Add
                    </button>
                  </div>

                  {/* Render newly drafted subtasks list */}
                  {subtasksInput.length > 0 && (
                    <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-2 max-h-[110px] overflow-y-auto">
                      {subtasksInput.map((sub, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs text-gray-400">
                          <span>• {sub.title}</span>
                          <button
                            type="button"
                            onClick={() => removeSubtaskFromInput(idx)}
                            className="text-red-400 hover:underline text-[10px]"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Row */}
                <button
                  type="submit"
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/15"
                >
                  <CheckCircle className="w-4 h-4" />
                  Save task to aura
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RENDER EDIT / DETAILED TASK SIDEBAR MODAL */}
      <AnimatePresence>
        {selectedTask && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTask(null)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />
            
            <motion.div
              variants={scaleUp}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="w-full max-w-2xl bg-dark-900 border border-white/10 rounded-2xl p-6 md:p-8 z-10 shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedTask(null)}
                className="absolute top-4 right-4 p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Task category priority */}
              <div className="flex gap-2.5 items-center mb-3">
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${getCategoryStyle(selectedTask.category)}`}>
                  {selectedTask.category}
                </span>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${getPriorityBadge(selectedTask.priority)}`}>
                  {selectedTask.priority}
                </span>
              </div>

              {/* Header Info */}
              <h3 className="text-xl font-bold text-gray-100">{selectedTask.title}</h3>
              {selectedTask.description && (
                <p className="text-xs text-gray-400 mt-2 bg-white/[0.01] border border-white/5 rounded-xl p-3.5">
                  {selectedTask.description}
                </p>
              )}

              {/* Checklist details block */}
              <div className="mt-6 space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Subtasks Checklists</h4>
                
                <div className="space-y-2">
                  {selectedTask.subtasks && selectedTask.subtasks.map((sub) => (
                    <div 
                      key={sub._id}
                      onClick={() => handleSubtaskToggle(selectedTask, sub._id)}
                      className="flex items-center gap-3 p-2.5 bg-white/[0.01] border border-white/5 hover:bg-white/5 rounded-xl cursor-pointer transition-colors"
                    >
                      {sub.completed ? (
                        <CheckSquare className="w-4.5 h-4.5 text-emerald-400" />
                      ) : (
                        <Square className="w-4.5 h-4.5 text-gray-500" />
                      )}
                      <span className={`text-xs ${sub.completed ? 'text-gray-500 line-through font-light' : 'text-gray-300'}`}>
                        {sub.title}
                      </span>
                    </div>
                  ))}

                  {(!selectedTask.subtasks || selectedTask.subtasks.length === 0) && (
                    <p className="text-xs text-gray-600 italic">No subtask checklists drafted on this task.</p>
                  )}
                </div>
              </div>

              {/* Comments details block */}
              <div className="mt-6 space-y-3 border-t border-white/5 pt-5">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" />
                  Task Discussions
                </h4>

                {/* List Comments */}
                <div className="space-y-2 max-h-[140px] overflow-y-auto">
                  {selectedTask.comments && selectedTask.comments.map((comm, idx) => (
                    <div key={idx} className="p-3 bg-white/[0.01] rounded-xl border border-white/5 text-xs text-gray-400">
                      <div className="flex justify-between font-bold text-[10px] text-gray-500 mb-1">
                        <span>{comm.userName}</span>
                        <span>{formatDate(comm.createdAt)}</span>
                      </div>
                      <p>{comm.text}</p>
                    </div>
                  ))}
                  {(!selectedTask.comments || selectedTask.comments.length === 0) && (
                    <p className="text-xs text-gray-600 italic">No comment discussions added yet.</p>
                  )}
                </div>

                {/* Post Comment Input */}
                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Ask a question or post progress..."
                    required
                    className="flex-1 rounded-xl bg-white/5 border border-white/5 focus:outline-none text-xs text-gray-300 px-3 py-2.5"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md"
                  >
                    Post
                  </button>
                </form>
              </div>

              {/* Sidebar Action Buttons (Delete, Close) */}
              <div className="mt-8 border-t border-white/5 pt-5 flex justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleDeleteClick(selectedTask._id)}
                  className="py-2.5 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  title="Remove this task entirely"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                  Delete Task
                </button>

                <div className="flex gap-2.5">
                  {selectedTask.status !== 'completed' && (
                    <button
                      type="button"
                      onClick={async () => {
                        await logPomodoro(selectedTask._id);
                        // Trigger local state updates
                        setSelectedTask(prev => ({ ...prev, pomodorosSpent: (prev.pomodorosSpent || 0) + 1 }));
                      }}
                      className="py-2.5 px-4 rounded-xl bg-orange-600/10 border border-orange-500/20 text-orange-400 hover:bg-orange-600 hover:text-white text-xs font-semibold transition-all"
                      title="Log completed pomodoro"
                    >
                      🍅 Log Focus
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setSelectedTask(null)}
                    className="py-2.5 px-5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs font-semibold transition-all"
                  >
                    Close Dialog
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Tasks;
