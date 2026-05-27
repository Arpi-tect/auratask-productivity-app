const express = require('express');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  addComment,
  logPomodoro,
  getAnalytics,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getAISuggestions } = require('../services/aiService');
const Task = require('../models/Task');

const router = express.Router();

// Apply protect middleware to all routes in this router
router.use(protect);

// Analytics endpoint (placed above /:id so it does not conflict)
router.get('/analytics', getAnalytics);

// AI Suggestions endpoint
router.get('/ai-suggest', async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    const suggestions = getAISuggestions(tasks);
    res.json({
      success: true,
      ...suggestions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Task CRUDS
router.route('/')
  .get(getTasks)
  .post(upload.array('attachments', 5), createTask); // Supports up to 5 file uploads

router.route('/:id')
  .put(upload.array('attachments', 5), updateTask)
  .delete(deleteTask);

// Sub-resources
router.post('/:id/comments', addComment);
router.post('/:id/pomodoro', logPomodoro);

module.exports = router;
