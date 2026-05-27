import { useState, useEffect, useCallback } from 'react';
import { taskAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { sampleTasks, sampleAnalytics, sampleAISuggestions } from '../data/sampleData';
import toast from 'react-hot-toast';

export const useTasks = (filters = {}) => {
  const { isDemoMode } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState(null);

  // Sync / Load Tasks
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    if (isDemoMode) {
      // Simulate API load
      setTimeout(() => {
        let stored = localStorage.getItem('demo_tasks');
        let parsed = stored ? JSON.parse(stored) : sampleTasks;
        
        // Filter/Search simulation
        let filtered = [...parsed];
        if (filters.status) filtered = filtered.filter(t => t.status === filters.status);
        if (filters.priority) filtered = filtered.filter(t => t.priority === filters.priority);
        if (filters.category) filtered = filtered.filter(t => t.category === filters.category);
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filtered = filtered.filter(t => 
            t.title.toLowerCase().includes(searchLower) || 
            t.description.toLowerCase().includes(searchLower)
          );
        }

        // Sorting simulation
        if (filters.sortBy === 'dueDate') {
          filtered.sort((a, b) => new Date(a.dueDate || '9999') - new Date(b.dueDate || '9999'));
        } else if (filters.sortBy === 'newest') {
          filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (filters.sortBy === 'oldest') {
          filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }

        setTasks(filtered);
        setLoading(false);
      }, 300);
      return;
    }

    try {
      const data = await taskAPI.getTasks(filters);
      if (data?.success) {
        setTasks(data.tasks);
      }
    } catch (error) {
      console.error('[useTasks] Error fetching:', error);
      // Fallback
      setTasks(sampleTasks);
    }
    setLoading(false);
  }, [filters.search, filters.status, filters.priority, filters.category, filters.sortBy, isDemoMode]);

  // Load Analytics
  const fetchAnalytics = useCallback(async () => {
    if (isDemoMode) {
      let stored = localStorage.getItem('demo_tasks');
      let currentTasks = stored ? JSON.parse(stored) : sampleTasks;
      
      const total = currentTasks.length;
      const completed = currentTasks.filter(t => t.status === 'completed').length;
      const inProgress = currentTasks.filter(t => t.status === 'in_progress').length;
      const todo = currentTasks.filter(t => t.status === 'todo').length;
      
      const totalPomodoros = currentTasks.reduce((sum, t) => sum + (t.pomodorosSpent || 0), 0);
      
      const categoryCounts = {};
      currentTasks.forEach(task => {
        categoryCounts[task.category] = (categoryCounts[task.category] || 0) + 1;
      });
      const categoryData = Object.keys(categoryCounts).map(cat => ({
        name: cat,
        value: categoryCounts[cat],
      }));

      const priorityCounts = { low: 0, medium: 0, high: 0 };
      currentTasks.forEach(task => {
        if (priorityCounts[task.priority] !== undefined) priorityCounts[task.priority] += 1;
      });

      setAnalytics({
        stats: {
          total, completed, inProgress, todo,
          completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
          totalPomodoros,
          productivityScore: Math.min(100, Math.max(30, (completed * 20) + (totalPomodoros * 5))),
          overdueCount: currentTasks.filter(t => t.status !== 'completed' && t.dueDate && new Date(t.dueDate) < new Date()).length,
          dailyGoal: 3,
          streakCurrent: 5,
          streakLongest: 12
        },
        categoryData,
        priorityCounts,
        activityData: sampleAnalytics.activityData
      });
      return;
    }

    try {
      const data = await taskAPI.getAnalytics();
      if (data?.success) {
        setAnalytics({
          stats: data.stats,
          categoryData: data.categoryData,
          priorityCounts: data.priorityCounts,
          activityData: data.activityData
        });
      }
    } catch (error) {
      setAnalytics(sampleAnalytics);
    }
  }, [isDemoMode]);

  // Load AI suggestions
  const fetchAISuggestions = useCallback(async () => {
    if (isDemoMode) {
      setAiSuggestions(sampleAISuggestions);
      return;
    }
    try {
      const data = await taskAPI.getAISuggestions();
      if (data?.success) {
        setAiSuggestions(data);
      }
    } catch (error) {
      setAiSuggestions(sampleAISuggestions);
    }
  }, [isDemoMode]);

  // Trigger loading initial list
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Create Task
  const createTask = async (taskData) => {
    if (isDemoMode) {
      let stored = localStorage.getItem('demo_tasks');
      let list = stored ? JSON.parse(stored) : sampleTasks;
      const newTask = {
        _id: `tsk_mock_${Date.now()}`,
        ...taskData,
        status: taskData.status || 'todo',
        priority: taskData.priority || 'medium',
        pomodorosSpent: 0,
        subtasks: taskData.subtasks || [],
        comments: [],
        attachments: [],
        createdAt: new Date().toISOString()
      };
      const updated = [newTask, ...list];
      localStorage.setItem('demo_tasks', JSON.stringify(updated));
      toast.success('Task created locally (Demo Mode)!');
      fetchTasks();
      return true;
    }

    try {
      const data = await taskAPI.createTask(taskData);
      if (data?.success) {
        toast.success('Task created successfully!');
        fetchTasks();
        return true;
      }
    } catch (error) {
      toast.error('Failed to create task.');
    }
    return false;
  };

  // Update Task
  const updateTask = async (id, taskData) => {
    if (isDemoMode) {
      let stored = localStorage.getItem('demo_tasks');
      let list = stored ? JSON.parse(stored) : sampleTasks;
      const updated = list.map(t => {
        if (t._id === id) {
          const compDate = taskData.status === 'completed' && t.status !== 'completed'
            ? new Date().toISOString()
            : (taskData.status !== 'completed' ? null : t.completedAt);
          return { ...t, ...taskData, completedAt: compDate };
        }
        return t;
      });
      localStorage.setItem('demo_tasks', JSON.stringify(updated));
      fetchTasks();
      return true;
    }

    try {
      const data = await taskAPI.updateTask(id, taskData);
      if (data?.success) {
        fetchTasks();
        return true;
      }
    } catch (error) {
      toast.error('Failed to update task.');
    }
    return false;
  };

  // Delete Task
  const deleteTask = async (id) => {
    if (isDemoMode) {
      let stored = localStorage.getItem('demo_tasks');
      let list = stored ? JSON.parse(stored) : sampleTasks;
      const updated = list.filter(t => t._id !== id);
      localStorage.setItem('demo_tasks', JSON.stringify(updated));
      toast.success('Task removed!');
      fetchTasks();
      return true;
    }

    try {
      const data = await taskAPI.deleteTask(id);
      if (data?.success) {
        toast.success('Task deleted.');
        fetchTasks();
        return true;
      }
    } catch (error) {
      toast.error('Failed to delete task.');
    }
    return false;
  };

  // Log Pomodoro focused session
  const logPomodoro = async (id) => {
    if (isDemoMode) {
      let stored = localStorage.getItem('demo_tasks');
      let list = stored ? JSON.parse(stored) : sampleTasks;
      const updated = list.map(t => {
        if (t._id === id) {
          return { ...t, pomodorosSpent: (t.pomodorosSpent || 0) + 1 };
        }
        return t;
      });
      localStorage.setItem('demo_tasks', JSON.stringify(updated));
      toast.success('Focus session logged to task!');
      fetchTasks();
      fetchAnalytics();
      return true;
    }

    try {
      const data = await taskAPI.logPomodoro(id);
      if (data?.success) {
        toast.success('Focus session saved!');
        fetchTasks();
        fetchAnalytics();
        return true;
      }
    } catch (error) {
      toast.error('Failed to log Pomodoro.');
    }
    return false;
  };

  // Add a task comment
  const addComment = async (id, text) => {
    if (isDemoMode) {
      let stored = localStorage.getItem('demo_tasks');
      let list = stored ? JSON.parse(stored) : sampleTasks;
      const updated = list.map(t => {
        if (t._id === id) {
          const comments = t.comments || [];
          return {
            ...t,
            comments: [...comments, { userName: "You", text, createdAt: new Date().toISOString() }]
          };
        }
        return t;
      });
      localStorage.setItem('demo_tasks', JSON.stringify(updated));
      fetchTasks();
      return true;
    }

    try {
      const data = await taskAPI.addComment(id, text);
      if (data?.success) {
        fetchTasks();
        return true;
      }
    } catch (error) {
      toast.error('Failed to post comment.');
    }
    return false;
  };

  return {
    tasks,
    loading,
    analytics,
    aiSuggestions,
    fetchTasks,
    fetchAnalytics,
    fetchAISuggestions,
    createTask,
    updateTask,
    deleteTask,
    logPomodoro,
    addComment
  };
};
