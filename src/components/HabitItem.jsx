import React, { useMemo, useState } from "react";

function computeProgress(history) {
  const completed = (history || []).filter((h) => h.completed).length;
  const total = Math.max(history.length, 364);
  return Math.round((completed / total) * 100);
}

function getPriorityVariant(priority) {
  const variants = {
    high: {
      gradient: "from-red-500/20 to-rose-500/15",
      border: "border-red-500/25",
      accent: "bg-gradient-to-r from-red-500 to-rose-500",
      text: "text-red-300",
      glow: "from-red-500/10 to-rose-500/5",
    },
    medium: {
      gradient: "from-amber-500/20 to-orange-500/15",
      border: "border-amber-500/25",
      accent: "bg-gradient-to-r from-amber-500 to-orange-500",
      text: "text-amber-300",
      glow: "from-amber-500/10 to-orange-500/5",
    },
    low: {
      gradient: "from-emerald-500/20 to-green-500/15",
      border: "border-emerald-500/25",
      accent: "bg-gradient-to-r from-emerald-500 to-green-500",
      text: "text-emerald-300",
      glow: "from-emerald-500/10 to-green-500/5",
    },
  };
  return (
    variants[priority] || {
      gradient: "from-slate-600/20 to-slate-700/15",
      border: "border-slate-600/25",
      accent: "bg-gradient-to-r from-blue-500 to-purple-600",
      text: "text-slate-300",
      glow: "from-blue-500/10 to-purple-500/5",
    }
  );
}

function getStatusVariant(completed) {
  return completed
    ? {
        gradient: "from-green-500/25 to-emerald-500/20",
        border: "border-green-500/30",
        accent: "bg-gradient-to-r from-green-500 to-emerald-500",
        text: "text-green-300",
        glow: "from-green-500/15 to-emerald-500/10",
      }
    : null;
}

export default function HabitItem({ habit, onToggle, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const progress = useMemo(
    () => computeProgress(habit.history),
    [habit.history]
  );

  const statusVariant = getStatusVariant(habit.completed);
  const priorityVariant = getPriorityVariant(habit.priority);
  const variant = statusVariant || priorityVariant;

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      if (
        confirm(
          `Are you sure you want to delete "${habit.name}"? This action cannot be undone.`
        )
      ) {
        onDelete();
      }
      setIsDeleting(false);
    }, 150);
  };

  const completedDays = habit.history?.filter((h) => h.completed).length || 0;
  const totalDays = habit.history?.length || 0;

  return (
    <div
      className={`
      group relative rounded-lg md:rounded-2xl backdrop-blur-sm border transition-all duration-500
      bg-gradient-to-br ${variant.gradient} ${variant.border}
      hover:shadow-xl md:hover:shadow-2xl hover:shadow-slate-900/40 hover:-translate-y-0.5 md:hover:-translate-y-1
      ${habit.completed ? "opacity-95 hover:opacity-100" : ""}
      ${isDeleting ? "scale-95 opacity-50" : ""}
    `}
    >
      {/* Animated accent bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-0.5 md:h-1 ${variant.accent} opacity-90 group-hover:opacity-100 transition-all duration-300`}
      />

      {/* Enhanced glow effect */}
      <div
        className={`absolute inset-0 rounded-lg md:rounded-2xl bg-gradient-to-r ${variant.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10`}
      />

      <div className="p-3 md:p-6">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-3 md:gap-6 mb-4 md:mb-6">
          <div className="flex-1 min-w-0">
            {/* Title with completion state */}
            <div className="flex items-start gap-2 md:gap-4 mb-2 md:mb-3">
              {habit.completed && (
                <div className="flex items-center justify-center w-6 md:w-8 h-6 md:h-8 bg-green-500/25 rounded-full border border-green-500/40 shadow-lg shadow-green-500/20 transition-all duration-300 group-hover:scale-110 flex-shrink-0 mt-1">
                  <svg
                    className="w-3 md:w-4 h-3 md:h-4 text-green-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3
                  className={`
                  text-base md:text-xl font-semibold transition-all duration-300 truncate
                  ${
                    habit.completed
                      ? "text-green-200 line-through decoration-2 decoration-green-400/70"
                      : "text-white"
                  }
                  group-hover:text-slate-100 group-hover:tracking-wide
                `}
                >
                  {habit.name}
                </h3>
                {habit.description && (
                  <p className="text-xs md:text-sm text-slate-400 mt-1 line-clamp-2">
                    {habit.description}
                  </p>
                )}
              </div>
            </div>

            {/* Enhanced Metadata */}
            <div className="flex items-center gap-2 flex-wrap">
              {habit.priority && !habit.completed && (
                <div className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-full border backdrop-blur-sm bg-black/25 transition-all duration-300 hover:scale-105">
                  <div
                    className={`w-1.5 md:w-2 h-1.5 md:h-2 rounded-full ${variant.accent} shadow-sm`}
                  />
                  <span
                    className={`text-xs md:text-xs font-semibold ${variant.text} uppercase tracking-wide`}
                  >
                    {habit.priority}
                  </span>
                </div>
              )}

              {habit.category && (
                <div className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-full text-slate-300 border border-slate-600/40 bg-black/25 backdrop-blur-sm transition-all duration-300 hover:scale-105">
                  <svg
                    className="w-3 h-3 text-slate-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  <span className="text-xs md:text-xs font-medium truncate">
                    {habit.category}
                  </span>
                </div>
              )}

              {habit.streak > 0 && (
                <div className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-full text-orange-300 border border-orange-500/40 bg-orange-500/15 backdrop-blur-sm transition-all duration-300 hover:scale-105">
                  <svg
                    className="w-3 h-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" />
                  </svg>
                  <span className="text-xs md:text-xs font-semibold">
                    {habit.streak}d
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Action buttons */}
          <div className="flex gap-2 md:gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={onToggle}
              className={`
                flex-1 sm:flex-none px-3 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 
                backdrop-blur-sm border hover:shadow-lg active:scale-95 min-w-0 sm:min-w-[100px] md:min-w-[120px]
                flex items-center justify-center gap-1 md:gap-2
                ${
                  habit.completed
                    ? "bg-green-500/15 text-green-300 border-green-500/40 hover:bg-green-500/25 hover:border-green-500/60 hover:shadow-green-500/25"
                    : "bg-blue-500/15 text-blue-300 border-blue-500/40 hover:bg-blue-500/25 hover:border-blue-500/60 hover:shadow-blue-500/25"
                }
              `}
            >
              {habit.completed ? (
                <>
                  <svg
                    className="w-3 md:w-4 h-3 md:h-4 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="hidden sm:inline">Done</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-3 md:w-4 h-3 md:h-4 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="hidden sm:inline">Complete</span>
                </>
              )}
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="
                flex-1 sm:flex-none px-3 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl text-xs md:text-sm font-semibold text-slate-300 
                bg-slate-700/40 border border-slate-600/40 backdrop-blur-sm
                hover:bg-red-500/15 hover:text-red-300 hover:border-red-500/40
                transition-all duration-300 hover:shadow-lg hover:shadow-red-500/15
                active:scale-95 min-w-0 sm:min-w-[100px] md:min-w-[120px] flex items-center justify-center gap-1 md:gap-2
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              <svg
                className="w-3 md:w-4 h-3 md:h-4 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        </div>

        {/* Enhanced Progress section */}
        <div className="space-y-2 md:space-y-4 pt-3 md:pt-5 border-t border-slate-700/40">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2 md:gap-3 flex-wrap">
              <span className="text-xs md:text-sm font-semibold text-slate-300 uppercase tracking-wide">
                Progress
              </span>
              <span className="text-xs text-slate-500 bg-slate-800/50 px-2 py-0.5 md:py-1 rounded-full border border-slate-700/50">
                {completedDays}/{totalDays}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base md:text-lg font-bold text-blue-300">
                {progress}%
              </span>
              {progress === 100 && (
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              )}
            </div>
          </div>

          {/* Enhanced Progress bar */}
          <div className="w-full h-2 md:h-3 bg-slate-700/60 rounded-full overflow-hidden border border-slate-600/40 backdrop-blur-sm">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-blue-500/40 relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
          </div>

          {/* Enhanced Progress indicators */}
          <div className="flex justify-between items-center text-xs text-slate-500">
            <span>Start</span>
            <span>Goal: 100%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
