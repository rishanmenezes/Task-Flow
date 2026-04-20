# 🚀 TaskFlow – Full Stack Task Manager

A modern, full-stack task management application built with the MERN stack. Features JWT authentication, user-specific task isolation, priority management, and a beautiful dark-themed UI.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss)

---

## 🌐 Live Demo

| Service  | URL                                    |
|----------|----------------------------------------|
| Frontend | `https://your-app.vercel.app`          |
| Backend  | `https://your-backend.onrender.com`    |

> Replace with your actual deployment URLs after deploying.

---

## 📌 Features

- **🔐 Authentication** — JWT-based register & login with bcrypt password hashing
- **📋 Task CRUD** — Create, read, update, and delete tasks
- **🎯 Priority Levels** — Low / Medium / High with colour-coded badges
- **🔒 Data Isolation** — Each user can only access their own tasks
- **✅ Task Completion** — Toggle tasks between active and completed
- **🔍 Filtering** — Filter tasks by status (All / Active / Completed)
- **📊 Dashboard Stats** — Live task counters at a glance
- **📱 Responsive** — Works beautifully on mobile, tablet, and desktop
- **🌙 Dark Theme** — Modern glassmorphism UI with gradient backgrounds

---

## 🛠 Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18 · Vite · Tailwind CSS 3   |
| Backend   | Node.js · Express 4                |
| Database  | MongoDB · Mongoose 8               |
| Auth      | JWT · bcryptjs                      |
| HTTP      | Axios                               |
| Routing   | React Router DOM 6                  |

---

## 📷 Screenshots

<details>
<summary>Click to expand screenshots</summary>

### Login Page
<!-- Add screenshot: ![Login](./screenshots/login.png) -->

### Signup Page
<!-- Add screenshot: ![Signup](./screenshots/signup.png) -->

### Dashboard
<!-- Add screenshot: ![Dashboard](./screenshots/dashboard.png) -->

</details>

---

## 📁 Project Structure

```
TaskFlow/
├── config/
│   └── db.js                  # MongoDB connection
├── middleware/
│   └── auth.js                # JWT verification middleware
├── models/
│   ├── User.js                # User schema + bcrypt hooks
│   └── Task.js                # Task schema
├── routes/
│   ├── auth.js                # POST /api/auth/register & /login
│   └── tasks.js               # CRUD /api/tasks (protected)
├── client/
│   ├── src/
│   │   ├── api/axios.js       # Axios instance + interceptors
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   └── TaskForm.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
├── .env.example
├── .gitignore
├── render.yaml                # Render deployment config
├── vercel.json                # Vercel deployment config
├── package.json
├── server.js
└── README.md
```

---

## ⚙️ Local Setup

### Prerequisites

- **Node.js** v18+ → [Download](https://nodejs.org)
- **MongoDB** — local install or [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier)
- **Git** → [Download](https://git-scm.com)

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/taskflow.git
cd taskflow
```

### 2. Setup Backend

```bash
# Install backend dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your values:
#   MONGO_URI=mongodb+srv://...   (your MongoDB Atlas connection string)
#   JWT_SECRET=<random-string>    (generate: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
#   CLIENT_URL=http://localhost:3000
```

### 3. Setup Frontend

```bash
cd client

# Install frontend dependencies
npm install

# Create environment file (optional for local dev)
cp .env.example .env
```

### 4. Run the Application

Open **two terminals**:

```bash
# Terminal 1 — Backend (port 5000)
npm run dev

# Terminal 2 — Frontend (port 3000)
cd client
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser 🎉

---

## 🔗 API Reference

### Auth (Public)

| Method | Endpoint             | Body                        | Description         |
|--------|----------------------|-----------------------------|---------------------|
| POST   | `/api/auth/register` | `{ name, email, password }` | Register a new user |
| POST   | `/api/auth/login`    | `{ email, password }`       | Login & get JWT     |

### Tasks (Protected — `Authorization: Bearer <token>`)

| Method | Endpoint         | Body                                              | Description   |
|--------|------------------|----------------------------------------------------|---------------|
| GET    | `/api/tasks`     | Query: `?completed=true&priority=high&sort=oldest` | Get all tasks |
| POST   | `/api/tasks`     | `{ title, description?, priority?, completed? }`   | Create task   |
| PUT    | `/api/tasks/:id` | `{ title?, description?, priority?, completed? }`  | Update task   |
| DELETE | `/api/tasks/:id` | —                                                  | Delete task   |

---

## 🚀 Deployment

### Backend → Render

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo
4. Configure:
   - **Root Directory:** `.` (leave empty)
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add **Environment Variables** in Render dashboard:
   ```
   NODE_ENV=production
   MONGO_URI=mongodb+srv://...
   JWT_SECRET=<your-secret>
   CLIENT_URL=https://your-app.vercel.app
   ```
6. Click **Create Web Service** → copy the deployed URL

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo
3. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `client`
4. Add **Environment Variable**:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```
5. Click **Deploy**

> **Important:** After deploying the frontend, go back to Render and update `CLIENT_URL` with your Vercel URL for CORS.

---

## 📦 Git & GitHub Commands

```bash
# Initialize git
git init

# Stage all files
git add .

# First commit
git commit -m "feat: initial commit — TaskFlow full-stack app"

# Create repo on GitHub (requires GitHub CLI)
gh repo create taskflow --public --source=. --push

# — OR push manually —
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/taskflow.git
git push -u origin main
```

---

## 🔒 Environment Variables

### Backend (`.env`)

| Variable      | Description                           | Example                                  |
|---------------|---------------------------------------|------------------------------------------|
| `MONGO_URI`   | MongoDB connection string             | `mongodb+srv://user:pass@cluster.mongodb.net/taskmanager` |
| `JWT_SECRET`  | Secret key for signing JWTs           | `a1b2c3d4...` (64+ chars)               |
| `PORT`        | Server port                           | `5000`                                   |
| `CLIENT_URL`  | Frontend URL for CORS                 | `https://your-app.vercel.app`            |
| `NODE_ENV`    | Environment mode                      | `production`                             |

### Frontend (`client/.env`)

| Variable       | Description            | Example                                         |
|----------------|------------------------|--------------------------------------------------|
| `VITE_API_URL` | Backend API base URL   | `https://your-backend.onrender.com/api`          |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m "feat: add amazing feature"`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).

---

<p align="center">
  Built with ❤️ using the MERN Stack
</p>
