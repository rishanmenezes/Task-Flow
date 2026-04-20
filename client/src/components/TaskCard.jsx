const priorityConfig = {
  high: {
    dot: "bg-rose-400",
    badge: "bg-rose-500/15 text-rose-400 border-rose-500/20",
    label: "High",
  },
  medium: {
    dot: "bg-amber-400",
    badge: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    label: "Medium",
  },
  low: {
    dot: "bg-emerald-400",
    badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    label: "Low",
  },
};

export default function TaskCard({ task, onToggle, onDelete }) {
  const priority = priorityConfig[task.priority] || priorityConfig.medium;

  return (
    <div
      className={`glass rounded-xl p-5 card-hover slide-up ${
        task.completed ? "opacity-60" : ""
      }`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 min-w-0">
          {/* Checkbox */}
          <button
            onClick={() => onToggle(task._id, !task.completed)}
            className={`mt-0.5 w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200 cursor-pointer ${
              task.completed
                ? "bg-indigo-500 border-indigo-500"
                : "border-slate-500 hover:border-indigo-400"
            }`}
          >
            {task.completed && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          {/* Title */}
          <h3
            className={`text-sm font-semibold leading-snug transition-all duration-200 ${
              task.completed
                ? "line-through text-slate-500"
                : "text-white"
            }`}
          >
            {task.title}
          </h3>
        </div>

        {/* Delete button */}
        <button
          onClick={() => onDelete(task._id)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200 flex-shrink-0 cursor-pointer"
          title="Delete task"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-slate-400 leading-relaxed mb-3 ml-8">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between ml-8">
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${priority.badge}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
          {priority.label}
        </span>

        <span className="text-[11px] text-slate-500">
          {new Date(task.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
    </div>
  );
}
