// UI and Date formatting helpers for AuraTask

/**
 * Formats standard ISO dates to a reader-friendly format
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'No due date';
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

/**
 * Returns specific color classes for task priority levels
 */
export const getPriorityBadge = (priority) => {
  switch (priority?.toLowerCase()) {
    case 'high':
      return 'bg-red-500/10 text-red-400 border border-red-500/20';
    case 'medium':
      return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
    case 'low':
      return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
    default:
      return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
  }
};

/**
 * Returns specific category styles (borders + background colors)
 */
export const getCategoryStyle = (category) => {
  const cat = category?.toLowerCase();
  if (cat === 'development' || cat === 'coding') {
    return 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20';
  }
  if (cat === 'design' || cat === 'ui/ux') {
    return 'bg-pink-500/10 text-pink-300 border border-pink-500/20';
  }
  if (cat === 'database' || cat === 'devops') {
    return 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20';
  }
  if (cat === 'marketing' || cat === 'growth') {
    return 'bg-amber-500/10 text-amber-300 border border-amber-500/20';
  }
  // Fallback default
  return 'bg-purple-500/10 text-purple-300 border border-purple-500/20';
};

/**
 * Calculates subtask completion ratio
 */
export const calculateProgress = (subtasks) => {
  if (!subtasks || subtasks.length === 0) return 0;
  const completed = subtasks.filter((t) => t.completed).length;
  return Math.round((completed / subtasks.length) * 100);
};

/**
 * Checks if a date is overdue
 */
export const isOverdue = (dateString, status) => {
  if (!dateString || status === 'completed') return false;
  return new Date(dateString) < new Date();
};
