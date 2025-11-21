import React from "react";

export default function SortDropdown({ sort, onChange }) {
  return (
    <div className="w-full">
      <select
        value={sort}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 cursor-pointer"
      >
        <option value="">Default</option>
        <option value="name">Name (A-Z)</option>
        <option value="currentStreak">Current Streak</option>
        <option value="longestStreak">Longest Streak</option>
      </select>
    </div>
  );
}
