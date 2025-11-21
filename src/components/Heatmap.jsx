import React, { useState } from "react";

// generate array of date strings YYYY-MM-DD for past 52 weeks (364 days), oldest first
function generateDates() {
  const dates = [];
  const today = new Date();
  // use client's local date converted to UTC YYYY-MM-DD to match backend logic
  const localYear = today.getFullYear();
  const localMonth = today.getMonth();
  const localDay = today.getDate();
  const todayUTCmid = new Date(Date.UTC(localYear, localMonth, localDay));
  for (let i = 363; i >= 0; i--) {
    const d = new Date(todayUTCmid.getTime() - i * 24 * 60 * 60 * 1000);
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(d.getUTCDate()).padStart(2, "0");
    dates.push(`${y}-${m}-${dd}`);
  }
  return dates;
}

// Get month labels for the heatmap
function getMonthLabels() {
  const months = [];
  const today = new Date();
  const localYear = today.getFullYear();
  const localMonth = today.getMonth();
  const localDay = today.getDate();
  const todayUTCmid = new Date(Date.UTC(localYear, localMonth, localDay));

  let currentMonth = null;
  for (let i = 363; i >= 0; i--) {
    const d = new Date(todayUTCmid.getTime() - i * 24 * 60 * 60 * 1000);
    const month = d.getUTCMonth();
    const week = Math.floor((363 - i) / 7);

    if (month !== currentMonth) {
      months.push({ week, month });
      currentMonth = month;
    }
  }
  return months;
}

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function getIntensityLevel(completed, streakCount = 1) {
  if (!completed) return 0;
  if (streakCount >= 6) return 4;
  if (streakCount >= 4) return 3;
  if (streakCount >= 2) return 2;
  return 1;
}

function formatDateDisplay(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

export default function Heatmap({ history = [] }) {
  const dates = generateDates();
  const monthLabels = getMonthLabels();
  const [hoveredDate, setHoveredDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  // Create a map of date to completion data
  const completionMap = new Map();
  (history || []).forEach(h => {
    completionMap.set(h.date, { completed: h.completed, streak: h.streak || 1 });
  });

  // Calculate stats with streak-based intensity
  const totalDays = dates.length;
  const completedDays = Array.from(completionMap.values()).filter(h => h.completed).length;
  const completionPercentage = Math.round((completedDays / totalDays) * 100);
  
  // Calculate current streak
  let currentStreak = 0;
  const today = new Date().toISOString().split('T')[0];
  for (let i = dates.length - 1; i >= 0; i--) {
    const date = dates[i];
    const data = completionMap.get(date);
    if (data?.completed) {
      currentStreak++;
    } else if (date <= today) {
      break;
    }
  }

  // Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 0;
  dates.forEach(date => {
    const data = completionMap.get(date);
    if (data?.completed) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  });

  const handleDateClick = (date) => {
    setSelectedDate(date === selectedDate ? null : date);
  };

  return (
    <div className="w-full bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
      {/* Header with enhanced stats */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Activity Heatmap
            </h3>
            <p className="text-sm text-slate-400">
              Visualize your consistency over the past year
            </p>
          </div>
          
          {/* Key metrics */}
          <div className="flex flex-wrap gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{completedDays}</div>
              <div className="text-xs text-slate-400">Days Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{completionPercentage}%</div>
              <div className="text-xs text-slate-400">Consistency</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{currentStreak}</div>
              <div className="text-xs text-slate-400">Current Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{longestStreak}</div>
              <div className="text-xs text-slate-400">Longest Streak</div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/30">
          <span className="text-sm font-medium text-slate-300">Activity Intensity</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Less</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map(level => (
                  <div
                    key={level}
                    className={`w-4 h-4 rounded border transition-all duration-200 ${
                      level === 0 
                        ? 'bg-slate-700/60 border-slate-600' 
                        : level === 1
                        ? 'bg-emerald-500/40 border-emerald-400/30'
                        : level === 2
                        ? 'bg-emerald-500/60 border-emerald-400/40'
                        : level === 3
                        ? 'bg-emerald-500/80 border-emerald-400/50'
                        : 'bg-emerald-500 border-emerald-400 shadow-lg shadow-emerald-500/20'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-400">More</span>
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="inline-block min-w-max">
          {/* Month labels */}
          <div className="flex gap-1 mb-3 ml-10">
            {monthLabels.map((label, idx) => (
              <div
                key={idx}
                className="text-xs font-medium text-slate-400 min-w-[28px] text-center"
                style={{ 
                  gridColumnStart: label.week * 7 + 1,
                  width: `${28 * 7 + 4}px`
                }}
              >
                {monthNames[label.month]}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          <div className="flex gap-2 items-start">
            {/* Weekday labels */}
            <div className="flex flex-col gap-1 mr-3 pt-0.5">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => (
                <div
                  key={idx}
                  className="w-8 h-4 text-xs text-slate-500 font-medium flex items-center justify-center"
                  style={{ minHeight: "16px" }}
                >
                  {[1, 3, 5].includes(idx) ? day : ''}
                </div>
              ))}
            </div>

            {/* Weeks grid */}
            <div className="flex gap-1">
              {Array.from({ length: 52 }).map((_, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-1">
                  {Array.from({ length: 7 }).map((__, dayIdx) => {
                    const idx = weekIdx * 7 + dayIdx;
                    const date = dates[idx];
                    const data = completionMap.get(date);
                    const completed = data?.completed || false;
                    const streakCount = data?.streak || 1;
                    const intensity = getIntensityLevel(completed, streakCount);
                    const isToday = date === new Date().toISOString().split("T")[0];
                    const isSelected = selectedDate === date;

                    const getCellClass = () => {
                      if (!completed) {
                        return 'bg-slate-700/40 border-slate-600 hover:bg-slate-600/60';
                      }
                      
                      switch (intensity) {
                        case 1: return 'bg-emerald-500/40 border-emerald-400/30 hover:bg-emerald-500/60';
                        case 2: return 'bg-emerald-500/60 border-emerald-400/40 hover:bg-emerald-500/80';
                        case 3: return 'bg-emerald-500/80 border-emerald-400/50 hover:bg-emerald-500';
                        case 4: return 'bg-emerald-500 border-emerald-400 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50';
                        default: return 'bg-slate-700/40 border-slate-600';
                      }
                    };

                    return (
                      <div
                        key={dayIdx}
                        className="group relative"
                        onMouseEnter={() => setHoveredDate(date)}
                        onMouseLeave={() => setHoveredDate(null)}
                        onClick={() => handleDateClick(date)}
                      >
                        <div
                          className={`
                            w-4 h-4 rounded border transition-all duration-300 cursor-pointer
                            ${getCellClass()}
                            ${isToday ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-800' : ''}
                            ${isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-800 scale-110' : ''}
                            hover:scale-110 transform
                          `}
                        />

                        {/* Enhanced Tooltip */}
                        {(hoveredDate === date || isSelected) && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-3 rounded-xl bg-slate-900/95 backdrop-blur-sm border border-slate-700 text-sm whitespace-nowrap z-50 shadow-2xl animate-fade-in">
                            <div className="font-semibold text-white mb-1">
                              {formatDateDisplay(date)}
                            </div>
                            <div className={`flex items-center gap-2 text-xs ${
                              completed ? 'text-green-400' : 'text-slate-400'
                            }`}>
                              {completed ? (
                                <>
                                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                  Completed • {streakCount > 1 ? `${streakCount} day streak` : 'Started'}
                                </>
                              ) : (
                                <>
                                  <div className="w-2 h-2 bg-slate-500 rounded-full" />
                                  Not completed
                                </>
                              )}
                            </div>
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-3 h-3 bg-slate-900 border-r border-b border-slate-700 rotate-45" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer with insights */}
      <div className="mt-6 pt-4 border-t border-slate-700/30">
        <div className="flex flex-wrap gap-6 justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500/40 rounded border border-emerald-400/30" />
            <span className="text-slate-400">1-2 days</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500/60 rounded border border-emerald-400/40" />
            <span className="text-slate-400">3-5 days</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500/80 rounded border border-emerald-400/50" />
            <span className="text-slate-400">6-10 days</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded border border-emerald-400 shadow-lg shadow-emerald-500/20" />
            <span className="text-slate-400">11+ days</span>
          </div>
        </div>
      </div>
    </div>
  );
}