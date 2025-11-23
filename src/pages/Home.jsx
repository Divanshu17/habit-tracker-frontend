import React, { useEffect, useState, useCallback } from "react";
import HabitForm from "../components/HabitForm";
import SortDropdown from "../components/SortDropdown";
import HabitList from "../components/HabitList";
import { getHabits, toggleHabit, deleteHabit } from "../api/habits";
import Heatmap from "../components/Heatmap";

export default function Home() {
  const [habits, setHabits] = useState([]);
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    active: 0,
    completionRate: 0,
  });
  const [aggregatedHistory, setAggregatedHistory] = useState([]);

  // helper to get today's local date converted to UTC YYYY-MM-DD
  function todayKeyUTC() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  const fetchHabits = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getHabits(sort);
      setHabits(data);

      // Calculate stats: "Completed" = habits completed today
      const today = todayKeyUTC();
      const completed = data.filter((habit) =>
        (habit.history || []).some((h) => h.date === today && h.completed)
      ).length;
      const active = data.length - completed;
      setStats({
        total: data.length,
        completed,
        active,
        completionRate:
          data.length > 0 ? Math.round((completed / data.length) * 100) : 0,
      });

      // Build aggregated history for past 52 weeks (expecting dates as YYYY-MM-DD in habit.history)
      // Map date -> boolean (true if any habit completed that date)
      const dateMap = new Map();
      for (const habit of data) {
        for (const entry of habit.history || []) {
          const key = entry.date;
          if (!dateMap.has(key)) dateMap.set(key, entry.completed);
          else if (!dateMap.get(key) && entry.completed) dateMap.set(key, true);
        }
      }

      // Generate array for last 364 days (oldest first) in YYYY-MM-DD matching Heatmap expectations
      const dates = [];
      const todayDate = new Date();
      const localYear = todayDate.getFullYear();
      const localMonth = todayDate.getMonth();
      const localDay = todayDate.getDate();
      const todayUTCmid = new Date(Date.UTC(localYear, localMonth, localDay));
      for (let i = 363; i >= 0; i--) {
        const d = new Date(todayUTCmid.getTime() - i * 24 * 60 * 60 * 1000);
        const y = d.getUTCFullYear();
        const m = String(d.getUTCMonth() + 1).padStart(2, "0");
        const dd = String(d.getUTCDate()).padStart(2, "0");
        const key = `${y}-${m}-${dd}`;
        dates.push({ date: key, completed: !!dateMap.get(key) });
      }
      setAggregatedHistory(dates);
    } catch (err) {
      console.error(err);
      alert("Error fetching habits");
    } finally {
      setLoading(false);
    }
  }, [sort]);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const handleToggle = async (id) => {
    try {
      await toggleHabit(id);
      await fetchHabits();
    } catch (err) {
      console.error(err);
      alert("Error toggling habit");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteHabit(id);
      await fetchHabits();
    } catch (err) {
      console.error(err);
      alert("Error deleting habit");
    }
  };

  // compute completed today list from habits
  const completedToday = (habits || []).filter((habit) =>
    (habit.history || []).some((h) => h.date === todayKeyUTC() && h.completed)
  );

  // compute active habits (not completed today)
  const activeHabits = (habits || []).filter(
    (habit) => !completedToday.find((c) => c._id === habit._id)
  );

  // View mode: "all", "active", "completed"
  const [viewMode, setViewMode] = useState("all");

  const habitsToShow =
    viewMode === "active"
      ? activeHabits
      : viewMode === "completed"
      ? completedToday
      : habits;

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center space-y-2 animate-slide-in-down">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
          Habit Tracker
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl mx-auto px-2">
          Build better habits, one day at a time. Track your progress with
          visual insights.
        </p>
      </div>

      {/* Enhanced Stats Cards with Stagger */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {{
          value: stats.total,
          label: "Total Habits",
          bgColor: "from-slate-700 to-slate-800",
          textColor: "text-white",
          icon: "📊",
        },
        {
          value: stats.completed,
          label: "Completed Today",
          bgColor: "from-green-900/30 to-green-800/20",
          textColor: "text-green-400",
          icon: "✓",
        },
        {
          value: stats.active,
          label: "Active Habits",
          bgColor: "from-blue-900/30 to-blue-800/20",
          textColor: "text-blue-400",
          icon: "⚡",
        },
        {
          value: `${stats.completionRate}%`,
          label: "Completion Rate",
          bgColor: "from-purple-900/30 to-purple-800/20",
          textColor: "text-purple-400",
          icon: "📈",
        },
      }.map((stat, idx) => (
          <div
            key={idx}
            className="group relative bg-gradient-to-br rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 border border-slate-600/50 hover:border-slate-500 transition-all duration-300 hover:shadow-lg stagger-item"
            style={{
              backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))`,
              backgroundSize: "100% 100%",
              animationDelay: `${idx * 50}ms`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-slate-600/0 to-slate-600/0 group-hover:from-slate-600/10 group-hover:to-slate-600/5 rounded-lg sm:rounded-xl md:rounded-2xl transition-colors duration-300" />
            <div className="relative">
              <div className={`text-2xl sm:text-3xl md:text-4xl font-bold ${stat.textColor}`}>
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1 sm:mt-2">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
        {/* Left Column - Form */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 border border-slate-600 lg:sticky lg:top-20 shadow-xl">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 flex items-center gap-2">
              <span className="w-1 h-5 md:h-6 bg-gradient-to-b from-green-400 to-blue-400 rounded" />
              Add Habit
            </h2>
            <HabitForm onCreated={fetchHabits} />
          </div>
        </div>

        {/* Right Column - List & Heatmap */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Global Heatmap Card */}
          <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg sm:rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-600 shadow-xl">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-gradient-to-b from-green-400 to-blue-400 rounded" />
              Activity Overview
            </h3>
            <div className="bg-slate-800/50 p-3 md:p-4 rounded-lg md:rounded-xl border border-slate-600/50 overflow-x-auto">
              <Heatmap history={aggregatedHistory} />
            </div>
          </div>

          {/* Completed Today Card */}
          {completedToday.length > 0 && (
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg sm:rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-600 shadow-xl animate-slide-in-up">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4 mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                  <span className="w-1 h-5 bg-gradient-to-b from-green-400 to-emerald-400 rounded" />
                  Completed Today
                </h3>
                <div className="text-xs sm:text-sm font-medium text-green-400">
                  {completedToday.length} / {habits.length}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                {completedToday.map((h, idx) => (
                  <div
                    key={h._id}
                    className="flex items-center justify-between bg-slate-800/50 p-2 sm:p-3 rounded-lg border border-green-600/30 hover:border-green-500/50 transition-all duration-200 stagger-item"
                    style={{ animationDelay: `${idx * 30}ms` }}
                  >
                    <div className="text-xs sm:text-sm font-medium text-green-400 flex items-center gap-2 truncate">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
                      <span className="truncate">{h.name}</span>
                    </div>
                    <button
                      onClick={() => handleToggle(h._id)}
                      className="ml-2 px-2 sm:px-3 py-1 text-xs font-medium rounded-lg bg-green-600/20 text-green-400 hover:bg-green-600/40 border border-green-600/50 hover:border-green-500 transition-all duration-200 flex-shrink-0"
                    >
                      Undo
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Habits List Card with View Mode Toggle */}
          <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg sm:rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-600 shadow-xl">
            {/* Header with Toggle Tabs */}
            <div className="flex flex-col gap-3 md:gap-4 mb-4 md:mb-6">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <span className="w-1 h-5 md:h-6 bg-gradient-to-b from-blue-400 to-purple-400 rounded" />
                  Your Habits
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-2">
                  {habitsToShow.length} habit
                  {habitsToShow.length !== 1 ? "s" : ""} to track
                </p>
              </div>
              <div className="w-full">
                <SortDropdown sort={sort} onChange={setSort} />
              </div>
            </div>

            {/* View Mode Toggle Tabs */}
            <div className="flex gap-2 mb-4 md:mb-6 flex-wrap">
              {{
                key: "all",
                label: "All",
                color: "from-blue-600 to-blue-700",
              },
              {
                key: "active",
                label: `Active (${activeHabits.length})`,
                color: "from-amber-600 to-amber-700",
              },
              {
                key: "completed",
                label: `Completed (${completedToday.length})`,
                color: "from-green-600 to-green-700",
              },
            }.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setViewMode(tab.key)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-all duration-300 ${
                    viewMode === tab.key
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                      : "bg-slate-800/50 text-slate-400 hover:text-slate-300 border border-slate-600/50 hover:border-slate-500"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content based on view mode */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 md:py-16">
                <div className="animate-spin rounded-full h-10 md:h-12 w-10 md:w-12 border-2 border-slate-600 border-t-blue-400 mb-4" />
                <div className="text-sm md:text-base text-slate-400">Loading habits...</div>
              </div>
            ) : habitsToShow.length === 0 ? (
              <div className="text-center py-12 md:py-16">
                <div className="text-slate-500 mb-4">
                  <svg
                    className="w-12 h-12 md:w-16 md:h-16 mx-auto opacity-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-300 mb-2">
                  {viewMode === "active" && "No active habits"}
                  {viewMode === "completed" && "No habits completed yet"}
                  {viewMode === "all" && "No habits yet"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 px-2">
                  {viewMode === "all" &&
                    "Create your first habit to get started"}
                  {viewMode === "active" && "All habits completed! Great job!"}
                  {viewMode === "completed" &&
                    "Start completing habits to see them here"}
                </p>
              </div>
            ) : (
              <div className="animate-fade-in">
                {viewMode === "active" && (
                  <div className="space-y-4">
                    <div className="text-xs font-semibold text-amber-400/70 uppercase tracking-wider mb-4">
                      {activeHabits.length} Active
                    </div>
                    <HabitList
                      habits={activeHabits}
                      onToggle={handleToggle}
                      onDelete={handleDelete}
                    />
                  </div>
                )}

                {viewMode === "completed" && (
                  <div className="space-y-4">
                    <div className="text-xs font-semibold text-green-400/70 uppercase tracking-wider mb-4">
                      {completedToday.length} Completed Today
                    </div>
                    <HabitList
                      habits={completedToday}
                      onToggle={handleToggle}
                      onDelete={handleDelete}
                    />
                  </div>
                )}

                {viewMode === "all" && (
                  <div className="space-y-6">
                    {/* Active Habits Section */}
                    {activeHabits.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-1 h-5 bg-gradient-to-b from-amber-400 to-orange-500 rounded" />
                          <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wider">
                            Active Habits ({activeHabits.length})
                          </h4>
                        </div>
                        <HabitList
                          habits={activeHabits}
                          onToggle={handleToggle}
                          onDelete={handleDelete}
                        />
                      </div>
                    )}

                    {/* Divider */}
                    {activeHabits.length > 0 && completedToday.length > 0 && (
                      <div className="border-t border-slate-600/30 my-6" />
                    )}

                    {/* Completed Habits Section */}
                    {completedToday.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-1 h-5 bg-gradient-to-b from-green-400 to-emerald-500 rounded" />
                          <h4 className="text-sm font-bold text-green-300 uppercase tracking-wider">
                            Completed Today ({completedToday.length})
                          </h4>
                        </div>
                        <HabitList
                          habits={completedToday}
                          onToggle={handleToggle}
                          onDelete={handleDelete}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
