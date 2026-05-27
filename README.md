<div align="center">

<img width="100%" src="https://capsule-render.vercel.app/api?type=venom&color=0:7B2FBE,50:3B82F6,100:06B6D4&height=200&section=header&text=AURATASK&fontSize=72&fontColor=ffffff&fontAlignY=60&desc=FOCUS.%20PLAN.%20ACHIEVE.&descAlignY=80&descSize=18&animation=fadeIn&fontStyle=italic" />

<img src="https://readme-typing-svg.demolab.com?font=Orbitron&weight=600&size=16&pause=2000&color=06B6D4&center=true&vCenter=true&width=650&height=40&lines=Advanced+SaaS+Productivity+Dashboard;Where+Focus+Meets+Flow+%E2%80%94+Your+Tasks%2C+Your+Aura.;Full-Stack+MERN+%7C+React+%2B+Node.js+%2B+MongoDB" alt="Tagline" />

<br/>

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_App-7C3AED?style=for-the-badge&labelColor=0D0014)](https://auratask-productivity-app.vercel.app)
[![Backend API](https://img.shields.io/badge/⚙️_Backend_API-Render-06B6D4?style=for-the-badge&labelColor=0D0014)](https://auratask-productivity-app.onrender.com/api/health)
[![GitHub Repo](https://img.shields.io/badge/💻_GitHub-Source_Code-3B82F6?style=for-the-badge&labelColor=0D0014&logo=github)](https://github.com/Arpi-tect/auratask-productivity-app)
[![MIT License](https://img.shields.io/badge/📄_License-MIT-A855F7?style=for-the-badge&labelColor=0D0014)](LICENSE)

<br/>

<img src="https://skillicons.dev/icons?i=react,nodejs,express,mongodb,vercel,vite,js,css&theme=dark&perline=8" alt="Tech Stack" />

</div>

<br/>

---

## 🌌 What is AuraTask?

**AuraTask** is a premium, full-stack **MERN SaaS productivity application** with a stunning glassmorphism dark UI. It combines smart task management, Pomodoro focus timers, and productivity analytics — all deployed live and production-ready.

```
🔐 JWT Auth  ·  📋 Task CRUD  ·  ⏱️ Pomodoro  ·  📊 Analytics  ·  🔍 Smart Filter  ·  📁 File Uploads
```

---

## ✨ Features at a Glance

| Feature | Description |
|---|---|
| 🔐 **Secure Authentication** | JWT-based signup & login with bcrypt password hashing |
| 📋 **Task Management** | Full CRUD — create, update, delete, organize tasks |
| 🎯 **Smart Priority System** | Color-coded priority labels with intelligent warnings |
| ⏱️ **Pomodoro Timer** | Built-in 25/5 min focus-break cycle timer |
| 📊 **Activity Analytics** | Visual productivity tracking over time |
| 🔍 **Search & Filter** | Filter by category, status, and priority |
| 💎 **Glassmorphism UI** | Stunning frosted-glass dark theme with gradient accents |
| 📁 **File Attachments** | Upload and attach files to tasks via Multer |
| 📱 **Fully Responsive** | Seamless on mobile, tablet, and desktop |

---

## 🛠️ Tech Stack

<div align="center">

### Frontend
| Tech | Purpose |
|------|---------|
| ⚛️ React 18 | Component-based UI framework |
| ⚡ Vite | Lightning-fast build tool & dev server |
| 🎨 CSS / Glassmorphism | Dark-themed premium custom styling |
| 🔗 Axios | HTTP client for API communication |

### Backend
| Tech | Purpose |
|------|---------|
| 🟢 Node.js | Server-side JavaScript runtime |
| 🚂 Express.js | Minimal web framework for REST APIs |
| 🍃 MongoDB Atlas | Cloud NoSQL database |
| 🦴 Mongoose | Elegant ODM for MongoDB schemas |
| 🔑 JWT | Secure stateless authentication |
| 🔒 bcryptjs | Password hashing |
| 📤 Multer | Multipart file upload middleware |
| 🌍 CORS | Cross-origin resource sharing |

### Deployment
| Service | Purpose |
|---------|---------|
| ▲ Vercel | Frontend hosting with CI/CD |
| 🔵 Render | Backend API hosting |
| 🍃 MongoDB Atlas | Production cloud database |
| 🐙 GitHub | Version control & source of truth |

</div>

---

## 🗺️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        USER BROWSER                          │
│                  React 18 + Vite  (Vercel)                   │
└─────────────────────┬───────────────────────────────────────┘
                      │  HTTPS / Axios API Calls
                      ▼
┌─────────────────────────────────────────────────────────────┐
│               BACKEND REST API  (Render)                     │
│              Node.js + Express.js                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
│  │  /auth   │  │  /tasks  │  │ /uploads │  │  /health   │  │
│  │ register │  │  CRUD    │  │  Multer  │  │   status   │  │
│  │  login   │  │ filtered │  │          │  │            │  │
│  └──────────┘  └──────────┘  └──────────┘  └────────────┘  │
│                    │  JWT Middleware                          │
└────────────────────┼────────────────────────────────────────┘
                     │  Mongoose ODM
                     ▼
┌─────────────────────────────────────────────────────────────┐
│               MongoDB Atlas  (Cloud)                         │
│    Collections: users  |  tasks  |  uploads                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
auratask-productivity-app/
├── 🗂️ backend/
│   ├── config/
│   │   └── db.js              # MongoDB Atlas connection
│   ├── controllers/           # Route business logic
│   ├── middleware/
│   │   └── auth.js            # JWT verification middleware
│   ├── models/
│   │   ├── User.js            # User schema (email, password hash)
│   │   └── Task.js            # Task schema (title, priority, status)
│   ├── routes/
│   │   ├── authRoutes.js      # POST /api/auth/register & login
│   │   └── taskRoutes.js      # GET/POST/PUT/DELETE /api/tasks
│   ├── services/              # Reusable business logic helpers
│   ├── uploads/               # Multer file storage directory
│   ├── .env.example           # Sample environment variables
│   └── server.js              # Express app entry point
│
├── 🎨 frontend/
│   ├── src/
│   │   ├── components/        # Reusable React UI components
│   │   ├── pages/             # Full-page views (Login, Dashboard)
│   │   └── main.jsx           # React app entry point
│   ├── public/                # Static assets
│   ├── index.html             # HTML shell
│   └── vite.config.js         # Vite configuration
│
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start — Run Locally

### Prerequisites
- Node.js v18+
- A free [MongoDB Atlas](https://cloud.mongodb.com) account

### 1️⃣ Clone

```bash
git clone https://github.com/Arpi-tect/auratask-productivity-app.git
cd auratask-productivity-app
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`:
```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=30d
```

```bash
npm run dev
# ✅ Server running on http://localhost:5000
```

### 3️⃣ Frontend Setup

```bash
cd ../frontend
npm install
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
# ✅ App running on http://localhost:5173
```

---

## 🌐 Deployment Guide

### Backend → Render
1. Go to [render.com](https://render.com) → New Web Service
2. Connect your GitHub repo
3. Root Directory: `backend`
4. Build Command: `npm install`
5. Start Command: `node server.js`
6. Add environment variables from your `.env`

### Frontend → Vercel
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Root Directory: `frontend`
4. Framework: **Vite**
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Add: `VITE_API_URL=https://your-render-app.onrender.com/api`

---

## 🔗 API Reference

### 🔐 Auth Endpoints
| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | `{name, email, password}` | Register new user |
| `POST` | `/api/auth/login` | `{email, password}` | Login, returns JWT |

### 📋 Task Endpoints *(JWT Required)*
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tasks` | Fetch all user tasks |
| `POST` | `/api/tasks` | Create a new task |
| `PUT` | `/api/tasks/:id` | Update task by ID |
| `DELETE` | `/api/tasks/:id` | Delete task by ID |

### 🟢 Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Returns API status & uptime |

---

## 🌐 Live Links

<div align="center">

| 🔗 Service | 🌍 URL |
|-----------|--------|
| 🎨 Frontend | [auratask-productivity-app.vercel.app](https://auratask-productivity-app.vercel.app) |
| ⚙️ Backend API | [onrender.com/api/health](https://auratask-productivity-app.onrender.com/api/health) |
| 🗄️ Database | MongoDB Atlas (Cloud) |
| 💻 Source Code | [github.com/Arpi-tect](https://github.com/Arpi-tect/auratask-productivity-app) |

</div>

---

## 👩‍💻 Author

<div align="center">

**Arpita** — Full-Stack Developer

[![GitHub](https://img.shields.io/badge/GitHub-Arpi--tect-7C3AED?style=for-the-badge&logo=github&labelColor=0D0014)](https://github.com/Arpi-tect)

</div>

---

## 📄 License

```
MIT License — Free for learning, portfolio, and educational use.
```

---

<div align="center">

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:06B6D4,50:7C3AED,100:D946EF&height=120&section=footer&text=Made%20with%20%E2%9D%A4%EF%B8%8F%20by%20Arpita&fontSize=20&fontColor=ffffff&fontAlignY=65&animation=fadeIn" />

[![Stars](https://img.shields.io/github/stars/Arpi-tect/auratask-productivity-app?style=social)](https://github.com/Arpi-tect/auratask-productivity-app/stargazers)

</div>
