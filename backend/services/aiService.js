/**
 * mock AIService to provide intelligent task advice, scheduling recommendations,
 * and warnings based on user workloads.
 */

const getAISuggestions = (tasks) => {
  const suggestions = [];
  const warnings = [];
  const productivityTips = [
    "Try the 25/5 Pomodoro method. It prevents mental exhaustion and improves deep focus.",
    "Tackle your 'High Priority' tasks first thing in the morning when your mental energy is peak.",
    "Group similar minor tasks (like replying to emails) into a single 30-minute block instead of checking them constantly.",
    "Review your completed checklist at the end of the day. Acknowledging progress builds a healthy completion habit.",
    "If a task takes less than 2 minutes to complete, do it immediately. Don't add it to your backlog."
  ];

  // Heuristic Analysis
  const now = new Date();
  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const highPriority = pendingTasks.filter(t => t.priority === 'high');
  const overdue = pendingTasks.filter(t => {
    return t.dueDate && new Date(t.dueDate) < now;
  });
  const dueSoon = pendingTasks.filter(t => {
    if (!t.dueDate) return false;
    const due = new Date(t.dueDate);
    const diff = due - now;
    return diff > 0 && diff < (24 * 60 * 60 * 1000); // due in 24 hours
  });

  // 1. Generate Warnings
  if (overdue.length > 0) {
    warnings.push({
      type: 'overdue',
      message: `You have ${overdue.length} overdue task(s). Consider rescheduling or immediate action.`,
      targetTasks: overdue.map(t => ({ id: t._id, title: t.title })),
    });
  }

  if (dueSoon.length > 0) {
    warnings.push({
      type: 'due_soon',
      message: `Critical: ${dueSoon.length} task(s) are due within the next 24 hours.`,
      targetTasks: dueSoon.map(t => ({ id: t._id, title: t.title })),
    });
  }

  // 2. Generate Suggestions
  if (pendingTasks.length === 0) {
    suggestions.push({
      title: "Clean Slate!",
      description: "You have no pending tasks. It is the perfect time to plan ahead and draft items for tomorrow.",
      action: "Create a new task",
    });
  } else {
    // If they have high-priority tasks
    if (highPriority.length > 0) {
      suggestions.push({
        title: "Focus Priority",
        description: `Tackle your primary high-priority task: "${highPriority[0].title}". It holds the highest impact right now.`,
        action: "Focus Task",
        taskId: highPriority[0]._id,
      });
    }

    // Category recommendations
    const categoryCounts = {};
    pendingTasks.forEach(t => {
      categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
    });

    const categories = Object.keys(categoryCounts);
    if (categories.length > 0) {
      const topCat = categories.reduce((a, b) => categoryCounts[a] > categoryCounts[b] ? a : b);
      if (categoryCounts[topCat] >= 3) {
        suggestions.push({
          title: `Optimize ${topCat}`,
          description: `You have ${categoryCounts[topCat]} tasks stacked in "${topCat}". Consider delegating or splitting them into subtasks.`,
          action: "Review Checklist",
        });
      }
    }
  }

  // Random tip selector
  const randomTip = productivityTips[Math.floor(Math.random() * productivityTips.length)];

  // 3. Suggested Daily Schedule
  const suggestedSchedule = [];
  let timeCursor = 9; // Start at 9:00 AM
  
  const sortedForSchedule = [...pendingTasks].sort((a, b) => {
    // Sort High first, then due date
    if (a.priority === 'high' && b.priority !== 'high') return -1;
    if (a.priority !== 'high' && b.priority === 'high') return 1;
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;
    return 0;
  });

  sortedForSchedule.slice(0, 3).forEach((task) => {
    suggestedSchedule.push({
      time: `${timeCursor}:00 AM`,
      duration: '1.5 Hours',
      taskTitle: task.title,
      taskId: task._id,
      activity: task.priority === 'high' ? 'Deep Work focus session' : 'Standard task progression',
    });
    timeCursor += 2; // Add 2 hours gap
  });

  return {
    suggestions,
    warnings,
    tip: randomTip,
    schedule: suggestedSchedule,
  };
};

module.exports = { getAISuggestions };
