import { useState, useEffect, useCallback } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all | active | completed

  // ——— Fetch tasks ———
  const fetchTasks = useCallback(async () => {
    try {
      setError("");
      const { data } = await API.get("/tasks");
      setTasks(data.data);
    } catch (err) {
      setError("Failed to load tasks. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ——— Add task ———
  const handleAdd = async (taskData) => {
    setAdding(true);
    try {
      const { data } = await API.post("/tasks", taskData);
      setTasks((prev) => [data.data, ...prev]);
    } catch (err) {
      setError("Failed to create task.");
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  // ——— Toggle complete ———
  const handleToggle = async (id, completed) => {
    try {
      const { data } = await API.put(`/tasks/${id}`, { completed });
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? data.data : t))
      );
    } catch (err) {
      setError("Failed to update task.");
      console.error(err);
    }
  };

  // ——— Delete task ———
  const handleDelete = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      setError("Failed to delete task.");
      console.error(err);
    }
  };

  // ——— Filtered tasks ———
  const filtered = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const stats = {
    total: tasks.length,
    active: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
  };

  return (
    <div className="gradient-bg min-h-screen">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 fade-in">
        {/* Welcome header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Good {getGreeting()},{" "}
            <span className="text-gradient">{user?.name?.split(" ")[0]}</span> 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {stats.active === 0
              ? "You're all caught up! 🎉"
              : `You have ${stats.active} task${stats.active !== 1 ? "s" : ""} to complete`}
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: "Total", value: stats.total, color: "text-indigo-400" },
            { label: "Active", value: stats.active, color: "text-amber-400" },
            { label: "Done", value: stats.completed, color: "text-emerald-400" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-xl p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Add task form */}
        <div className="mb-6">
          <TaskForm onAdd={handleAdd} loading={adding} />
        </div>

        {/* Filter tabs */}
        {tasks.length > 0 && (
          <div className="flex items-center gap-1 mb-5 p-1 glass rounded-xl w-fit">
            {["all", "active", "completed"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition-all duration-200 cursor-pointer ${
                  filter === f
                    ? "bg-indigo-500/20 text-indigo-400"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div className="mb-5 px-4 py-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm text-center">
            {error}
            <button
              onClick={() => setError("")}
              className="ml-2 underline hover:no-underline cursor-pointer"
            >
              dismiss
            </button>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <svg className="w-8 h-8 animate-spin mb-3 text-indigo-400" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-sm">Loading your tasks...</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && tasks.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 mb-4">
              <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-1">No tasks yet</h3>
            <p className="text-slate-500 text-sm">
              Click &quot;Add a new task&quot; above to get started
            </p>
          </div>
        )}

        {/* Filtered empty state */}
        {!loading && tasks.length > 0 && filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 text-sm">
              No {filter} tasks found
            </p>
          </div>
        )}

        {/* Task list */}
        {!loading && filtered.length > 0 && (
          <div className="space-y-3">
            {filtered.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// ——— Helper ———
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
