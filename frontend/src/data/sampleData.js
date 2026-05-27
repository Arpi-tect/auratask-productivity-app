// High-fidelity fallback sample data for instant showcase and off-grid testing

export const sampleUser = {
  _id: "usr_mock_1122",
  name: "Alex Mercer",
  email: "alex.mercer@aura.dev",
  avatar: "",
  streakCurrent: 5,
  streakLongest: 12,
  badges: ["Streak Starter", "Deep Work Champ", "Focus Rookie"],
  dailyGoal: 3
};

export const sampleTasks = [
  {
    _id: "tsk_1",
    title: "Implement OAuth2 Authentication Flow",
    description: "Create JWT token generation, cookie storage, and protected route handlers on the Express router. Hook up frontend React Context.",
    status: "in_progress",
    priority: "high",
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // tomorrow
    category: "Development",
    subtasks: [
      { _id: "sub_1_1", title: "Set up Passport or jsonwebtoken options", completed: true },
      { _id: "sub_1_2", title: "Write AuthContext provider in React", completed: false },
      { _id: "sub_1_3", title: "Test login expire states and redirects", completed: false }
    ],
    comments: [
      { userName: "Arpita", text: "Make sure you encrypt the payload properly in the token claims.", createdAt: new Date() }
    ],
    attachments: [],
    isRecurring: false,
    recurrenceInterval: "none",
    pomodorosSpent: 3,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "tsk_2",
    title: "Design Landing Page Glassmorphism Hero Section",
    description: "Incorporate CSS blob backdrops, blurred glass panels, floating gradients, and entry slide variants with Framer Motion.",
    status: "todo",
    priority: "medium",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    category: "Design",
    subtasks: [
      { _id: "sub_2_1", title: "Draft wireframe in Figma", completed: true },
      { _id: "sub_2_2", title: "Write custom background blob animations", completed: false }
    ],
    comments: [],
    attachments: [],
    isRecurring: false,
    recurrenceInterval: "none",
    pomodorosSpent: 0,
    createdAt: new Date().toISOString()
  },
  {
    _id: "tsk_3",
    title: "Database Performance Audit & Query Indexing",
    description: "Inspect MongoDB Atlas slow queries. Implement secondary indices on compound task fields like user_id and status.",
    status: "completed",
    priority: "high",
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // yesterday
    category: "Database",
    subtasks: [
      { _id: "sub_3_1", title: "Analyze index efficiency using explain()", completed: true },
      { _id: "sub_3_2", title: "Apply compound index to user + status fields", completed: true }
    ],
    comments: [],
    attachments: [],
    isRecurring: false,
    recurrenceInterval: "none",
    pomodorosSpent: 4,
    completedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "tsk_4",
    title: "Draft Q3 SaaS Product Roadmap & Feature Spec",
    description: "Align with stakeholders on implementing Pomodoro timers, subtask checklists, and AI priority suggestion modules.",
    status: "completed",
    priority: "low",
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    category: "Marketing",
    subtasks: [
      { _id: "sub_4_1", title: "Schedule roadmap sync call", completed: true },
      { _id: "sub_4_2", title: "Publish spec markdown doc", completed: true }
    ],
    comments: [],
    attachments: [],
    isRecurring: true,
    recurrenceInterval: "monthly",
    pomodorosSpent: 1,
    completedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "tsk_5",
    title: "Refactor API Axios Service Layer",
    description: "Migrate raw axios calls into a central client class supporting request/response interceptors to attach bearer tokens automatically.",
    status: "todo",
    priority: "medium",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    category: "Development",
    subtasks: [],
    comments: [],
    attachments: [],
    isRecurring: false,
    recurrenceInterval: "none",
    pomodorosSpent: 0,
    createdAt: new Date().toISOString()
  }
];

export const sampleAnalytics = {
  stats: {
    total: 5,
    completed: 2,
    inProgress: 1,
    todo: 2,
    completionRate: 40,
    totalPomodoros: 8,
    productivityScore: 78,
    overdueCount: 0,
    dailyGoal: 3,
    streakCurrent: 5,
    streakLongest: 12
  },
  categoryData: [
    { name: "Development", value: 2 },
    { name: "Design", value: 1 },
    { name: "Database", value: 1 },
    { name: "Marketing", value: 1 }
  ],
  priorityCounts: { low: 1, medium: 2, high: 2 },
  activityData: [
    { date: "2026-05-14", formattedDate: "May 14", count: 0 },
    { date: "2026-05-15", formattedDate: "May 15", count: 1 },
    { date: "2026-05-16", formattedDate: "May 16", count: 0 },
    { date: "2026-05-17", formattedDate: "May 17", count: 2 },
    { date: "2026-05-18", formattedDate: "May 18", count: 0 },
    { date: "2026-05-19", formattedDate: "May 19", count: 1 },
    { date: "2026-05-20", formattedDate: "May 20", count: 0 },
    { date: "2026-05-21", formattedDate: "May 21", count: 3 },
    { date: "2026-05-22", formattedDate: "May 22", count: 1 },
    { date: "2026-05-23", formattedDate: "May 23", count: 0 },
    { date: "2026-05-24", formattedDate: "May 24", count: 2 },
    { date: "2026-05-25", formattedDate: "May 25", count: 0 },
    { date: "2026-05-26", formattedDate: "May 26", count: 1 },
    { date: "2026-05-27", formattedDate: "May 27", count: 2 }
  ]
};

export const sampleAISuggestions = {
  suggestions: [
    {
      title: "Focus Priority",
      description: "Tackle your primary high-priority task: 'Implement OAuth2 Authentication Flow'. It holds the highest impact right now.",
      action: "Focus Task",
      taskId: "tsk_1"
    },
    {
      title: "Optimize Development",
      description: "You have 2 tasks stacked in 'Development'. Consider splitting them into smaller focus blocks.",
      action: "Review Checklist"
    }
  ],
  warnings: [
    {
      type: "due_soon",
      message: "Critical: 'Implement OAuth2 Authentication Flow' is due within the next 24 hours.",
      targetTasks: [{ id: "tsk_1", title: "Implement OAuth2 Authentication Flow" }]
    }
  ],
  tip: "Try the 25/5 Pomodoro method. It prevents mental exhaustion and improves deep focus.",
  schedule: [
    {
      time: "9:00 AM",
      duration: "1.5 Hours",
      taskTitle: "Implement OAuth2 Authentication Flow",
      taskId: "tsk_1",
      activity: "Deep Work focus session"
    },
    {
      time: "11:00 AM",
      duration: "1.5 Hours",
      taskTitle: "Design Landing Page Glassmorphism Hero Section",
      taskId: "tsk_2",
      activity: "Standard task progression"
    }
  ]
};
