# AuraTask ⚡ Next-Gen AI-Powered Productivity Dashboard

AuraTask is a production-grade, state-of-the-art SaaS Task Manager and productivity hub designed with a sleek dark glassmorphism aesthetic, fluid Framer Motion animations, comprehensive task boards, focus Pomodoro clocks, and automated AI workload analysis. 

Built with the modern **MERN stack**, it provides industry-standard clean architecture, protected JWT credential systems, active task streak tracking, and customizable daily goals.

---

## 🚀 Key Features

* **Glassmorphic UI**: High-fidelity dark mode with neon gradients, blurred panels, and micro-interactions.
* **Kanban & Detail Views**: Toggle instantly between interactive Kanban sprint boards and detailed checklists.
* **Integrated Pomodoro Timer**: Dedicated Focus Timer with circular SVG progress, sound alarms (browser synthesised), and task association to log deep-focus points.
* **Productivity Score & Streaks**: Automatic tracking of user activity streaks and gamified achievement badges (unlocked via Pomodoro counts and daily goal milestones).
* **Automated AI Workload Advice**: Mock AI recommendation engine evaluating deadlines, priority stacks, and category volumes to generate daily focus timetables.
* **Axios interceptors & Fallback Simulation**: Built-in recruiter-friendly "Demo Showcase Mode" fallback letting recruiters test 100% of features with one-click offline mocks if a live database isn't connected.

---

## 🛠️ Tech Stack

### Frontend
* **Core**: React.js 18 + Vite (ESM)
* **Styling**: Tailwind CSS + custom filters
* **Animations**: Framer Motion 11
* **Analytics**: Recharts
* **Notifications**: React Hot Toast
* **Icons**: Lucide React

### Backend
* **Runtime**: Node.js + Express.js
* **Database**: MongoDB + Mongoose Schemas
* **Security**: JWT tokens + bcryptjs encryption
* **Attachments**: Multer local disk engines

---

## 📂 Architecture Structure

```
saas-task-manager/
 ├── backend/
 │    ├── config/          # DB connection
 │    ├── controllers/     # Authentication & Task aggregations
 │    ├── middleware/      # JWT gates & Multer engines
 │    ├── models/          # Mongoose database models
 │    ├── routes/          # REST endpoints
 │    ├── services/        # AI scheduler heuristics
 │    ├── uploads/         # Local attachment files storage
 │    └── server.js        # Entry port configuration
 ├── frontend/
 │    ├── src/
 │    │    ├── animations/  # Staggered Framer Motion configurations
 │    │    ├── components/  # Glass wrappers, Kanban, Pomodoros
 │    │    ├── context/     # Auth Context with Demo Mode
 │    │    ├── data/        # High-fidelity mock fallbacks
 │    │    ├── hooks/       # Task API operations dispatcher
 │    │    ├── layouts/     # Protected sidebar frame
 │    │    ├── pages/       # Dashboard, Kanban, Profile grids
 │    │    ├── services/    # Axios client configs
 │    │    └── styles/      # Glow gradients & scrollbar hacks
 │    └── index.html
 ├── .gitignore
 └── README.md
```

---

## 🌐 API Documentation

### Authentication (`/api/auth`)
* `POST /register` - Registers an SDE account. Returns token.
* `POST /login` - Login. Calculates consecutive login streaks and unlocks badges. Returns token.
* `GET /me` - Resolves token, refreshes streak states, returns profile metadata.
* `PUT /profile` - Edits user name and custom daily task count goal.
* `PUT /avatar` - Uploads avatar image via Multer.

### Task Management (`/api/tasks`)
* `GET /` - Fetches all tasks. Supports filters (`status`, `priority`, `category`), searches, and sorts.
* `POST /` - Creates task with optional file uploads.
* `PUT /:id` - Edits task, manages checklist subtasks, marks status completions.
* `DELETE /:id` - Removes task.
* `POST /:id/comments` - Adds discussion post thread inside task cards.
* `POST /:id/pomodoro` - Logs completed Focus Timer session onto a task, awarding milestone badges.
* `GET /analytics` - Aggregates data for Recharts area charts, category pie charts, and productivity scores.
* `GET /ai-suggest` - Evaluates tasks to recommend focus objects and suggested daily schedules.

---

## 💻 Local Setup & Installation

Follow these simple steps to launch AuraTask locally.

### Step 1: Clone the workspace repository files
Ensure you have Node.js and MongoDB installed on your system.

### Step 2: Configure Environment Credentials
Create a `.env` file under the `/backend` folder using `/backend/.env.example` as a guideline:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/task_manager
JWT_SECRET=your_ultra_secure_super_secret_jwt_key_here_12345
JWT_EXPIRE=30d
```

### Step 3: Launch the Backend Server
Navigate to the `backend/` folder in your terminal:
```bash
cd backend
npm install
npm run dev
```
The server will bind and start listening on port `5000`.

### Step 4: Launch the Frontend App
Navigate to the `frontend/` folder in a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
Vite will boot and host the interactive application on `http://localhost:5173`. Open this URL in your web browser.

---

## 🐙 Push to GitHub Instructions

To upload this codebase to your own GitHub profile, run these commands in your workspace root:

```bash
# Initialize git
git init

# Add all files to staging
git add .

# Create initial commit
git commit -m "feat: Boot AuraTask high-fidelity fullstack workspace"

# Create a new repository on github.com, copy the URL, and link it:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Select main branch and push
git branch -M main
git push -u origin main
```

---

## ☁️ Deployment Instructions

### 1. Backend deployment on Render
1. Create a free account on [Render](https://render.com).
2. Click **New** > **Web Service**.
3. Link your GitHub repository.
4. Set the following settings:
   * **Name**: `auratask-backend`
   * **Root Directory**: `backend`
   * **Build Command**: `npm install`
   * **Start Command**: `node server.js`
5. Click **Advanced** and set the environment variables:
   * `MONGO_URI` (Use a free MongoDB Atlas connection string)
   * `JWT_SECRET` (Your private key signature)
   * `JWT_EXPIRE` (e.g., `30d`)
   * `NODE_ENV` (Set to `production`)
6. Click **Deploy Web Service**. Render will spin up your API server.

### 2. Frontend deployment on Vercel
1. Create an account on [Vercel](https://vercel.com).
2. Click **Add New** > **Project** and select your GitHub repository.
3. Set the following settings:
   * **Framework Preset**: `Vite`
   * **Root Directory**: `frontend`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
4. Click **Environment Variables** and add:
   * `VITE_API_URL` (Set to your Render deployment URL, e.g., `https://auratask-backend.onrender.com/api`)
5. Click **Deploy**. Vercel will build and host your glowing dashboard globally!
