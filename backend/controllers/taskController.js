const Task = require('../models/Task');
const User = require('../models/User');

/**
 * @desc    Get all user tasks (with search, filter, and sort)
 * @route   GET /api/tasks
 * @access  Private
 */
const getTasks = async (req, res) => {
  try {
    const { status, priority, category, search, sortBy } = req.query;
    
    // Build query object
    let query = { user: req.user.id };

    if (status) {
      query.status = status;
    }
    if (priority) {
      query.priority = priority;
    }
    if (category) {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Sorting
    let sortOptions = {};
    if (sortBy === 'dueDate') {
      sortOptions = { dueDate: 1 };
    } else if (sortBy === 'priority') {
      // Custom sorting: High = 1, Med = 2, Low = 3 (we can do basic or date-first)
      sortOptions = { priority: 1 };
    } else if (sortBy === 'newest') {
      sortOptions = { createdAt: -1 };
    } else if (sortBy === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else {
      sortOptions = { createdAt: -1 }; // Default to newest first
    }

    const tasks = await Task.find(query).sort(sortOptions);

    res.json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Private
 */
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      dueDate,
      category,
      subtasks,
      isRecurring,
      recurrenceInterval,
    } = req.body;

    // Handle uploaded file attachments if any
    let attachments = [];
    if (req.files) {
      attachments = req.files.map((file) => `/uploads/${file.filename}`);
    }

    // Parse subtasks if sent as a JSON string
    let parsedSubtasks = [];
    if (subtasks) {
      parsedSubtasks = typeof subtasks === 'string' ? JSON.parse(subtasks) : subtasks;
    }

    const task = await Task.create({
      user: req.user.id,
      title,
      description,
      status: status || 'todo',
      priority: priority || 'medium',
      dueDate,
      category: category || 'Work',
      subtasks: parsedSubtasks,
      attachments,
      isRecurring: isRecurring === 'true' || isRecurring === true,
      recurrenceInterval: recurrenceInterval || 'none',
    });

    res.status(201).json({
      success: true,
      task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update a task
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
const updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Verify task ownership
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to edit this task' });
    }

    // Handle files if appended in update
    let attachments = [...task.attachments];
    if (req.files) {
      const newFiles = req.files.map((file) => `/uploads/${file.filename}`);
      attachments = [...attachments, ...newFiles];
    }

    const {
      title,
      description,
      status,
      priority,
      dueDate,
      category,
      subtasks,
      isRecurring,
      recurrenceInterval,
      pomodorosSpent,
    } = req.body;

    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (priority !== undefined) updateFields.priority = priority;
    if (dueDate !== undefined) updateFields.dueDate = dueDate === '' ? null : dueDate;
    if (category !== undefined) updateFields.category = category;
    if (isRecurring !== undefined) updateFields.isRecurring = isRecurring;
    if (recurrenceInterval !== undefined) updateFields.recurrenceInterval = recurrenceInterval;
    if (pomodorosSpent !== undefined) updateFields.pomodorosSpent = pomodorosSpent;
    updateFields.attachments = attachments;

    if (subtasks !== undefined) {
      updateFields.subtasks = typeof subtasks === 'string' ? JSON.parse(subtasks) : subtasks;
    }

    // If status changed to completed, log the completion date
    if (status !== undefined) {
      updateFields.status = status;
      if (status === 'completed' && task.status !== 'completed') {
        updateFields.completedAt = new Date();
      } else if (status !== 'completed') {
        updateFields.completedAt = null;
      }
    }

    task = await Task.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete a task
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Check ownership
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this task' });
    }

    await task.deleteOne();

    res.json({
      success: true,
      message: 'Task removed successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Add comment to task
 * @route   POST /api/tasks/:id/comments
 * @access  Private
 */
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, message: 'Comment text is required' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const newComment = {
      userName: req.user.name,
      text,
      createdAt: new Date(),
    };

    task.comments.push(newComment);
    await task.save();

    res.json({
      success: true,
      task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Increment Pomodoro count on a task
 * @route   POST /api/tasks/:id/pomodoro
 * @access  Private
 */
const logPomodoro = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    task.pomodorosSpent += 1;
    await task.save();

    // Reward Pomodoro badges on User
    const user = await User.findById(req.user.id);
    if (user) {
      const userTasks = await Task.find({ user: user._id });
      const totalPomodoros = userTasks.reduce((acc, t) => acc + (t.pomodorosSpent || 0), 0);

      const badgesSet = new Set(user.badges);
      if (totalPomodoros >= 1) badgesSet.add('Focus Rookie');
      if (totalPomodoros >= 5) badgesSet.add('Pomodoro Master');
      if (totalPomodoros >= 20) badgesSet.add('Focus Wizard');
      user.badges = Array.from(badgesSet);
      await user.save();
    }

    res.json({
      success: true,
      pomodorosSpent: task.pomodorosSpent,
      task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get detailed productivity dashboard statistics
 * @route   GET /api/tasks/analytics
 * @access  Private
 */
const getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    const allTasks = await Task.find({ user: userId });
    
    const total = allTasks.length;
    const completed = allTasks.filter(t => t.status === 'completed').length;
    const inProgress = allTasks.filter(t => t.status === 'in_progress').length;
    const todo = allTasks.filter(t => t.status === 'todo').length;

    // Completion Rate
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Categories Distribution
    const categoryCounts = {};
    allTasks.forEach(task => {
      categoryCounts[task.category] = (categoryCounts[task.category] || 0) + 1;
    });
    const categoryData = Object.keys(categoryCounts).map(cat => ({
      name: cat,
      value: categoryCounts[cat],
    }));

    // Priorities Distribution
    const priorityCounts = { low: 0, medium: 0, high: 0 };
    allTasks.forEach(task => {
      if (priorityCounts[task.priority] !== undefined) {
        priorityCounts[task.priority] += 1;
      }
    });

    // Pomodoros focused count
    const totalPomodoros = allTasks.reduce((sum, t) => sum + (t.pomodorosSpent || 0), 0);

    // Heatmap / Activity Tracker (Count completions per day in past 14 days)
    const activityData = [];
    const today = new Date();
    
    for (let i = 13; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];

      const count = allTasks.filter(t => {
        if (!t.completedAt) return false;
        const compDate = new Date(t.completedAt).toISOString().split('T')[0];
        return compDate === dateString;
      }).length;

      activityData.push({
        date: dateString,
        formattedDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count,
      });
    }

    // Determine productivity score (0 - 100 based on completion rates, strengths, Pomodoro activity)
    const activeTasksWeight = completed * 10;
    const focusTimerWeight = totalPomodoros * 15;
    const rawScore = activeTasksWeight + focusTimerWeight;
    const productivityScore = Math.min(100, Math.max(10, Math.round((rawScore / (total * 10 || 1)) * 50) + 30));

    // Smart advice logic (AI mock suggestions)
    const overdueCount = allTasks.filter(t => {
      return t.status !== 'completed' && t.dueDate && new Date(t.dueDate) < new Date();
    }).length;

    res.json({
      success: true,
      stats: {
        total,
        completed,
        inProgress,
        todo,
        completionRate,
        totalPomodoros,
        productivityScore,
        overdueCount,
        dailyGoal: user ? user.dailyGoal : 3,
        streakCurrent: user ? user.streakCurrent : 0,
        streakLongest: user ? user.streakLongest : 0,
      },
      categoryData,
      priorityCounts,
      activityData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  addComment,
  logPomodoro,
  getAnalytics,
};
