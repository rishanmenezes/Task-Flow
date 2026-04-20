require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Route imports
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

// Middleware imports
const auth = require("./middleware/auth");

// --------------- App setup ---------------

const app = express();

// Body parsing
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// CORS — lock down to CLIENT_URL in production; permissive in dev
const corsOptions = {
  origin: process.env.CLIENT_URL || "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// --------------- Routes ---------------

// Health check
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Task Manager API is running 🚀",
    version: "1.0.0",
  });
});

// Auth routes (public)
app.use("/api/auth", authRoutes);

// Task routes (protected)
app.use("/api/tasks", auth, taskRoutes);

// --------------- 404 handler ---------------

app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// --------------- Global error handler ---------------

app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// --------------- Start server ---------------

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`   Environment : ${process.env.NODE_ENV || "development"}`);
    console.log(`   Health check: http://localhost:${PORT}/`);
  });
});
