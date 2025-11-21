import React from "react";
import HabitItem from "./HabitItem";

export default function HabitList({ habits = [], onToggle, onDelete }) {
  if (!habits.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
        {/* Animated empty state illustration */}
        <div className="relative mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-slate-700/50 to-slate-600/30 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-slate-600/30">
            <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-xl animate-pulse"></div>
        </div>
        
        <h3 className="text-lg font-semibold text-slate-200 mb-2">
          No Habits Tracked
        </h3>
        <p className="text-slate-400 max-w-sm text-sm leading-relaxed mb-4">
          Begin your journey to better habits. Create your first routine and track your progress over time.
        </p>
        <div className="flex gap-2 text-xs">
          <span className="bg-blue-500/10 text-blue-300 px-3 py-2 rounded-full border border-blue-500/20 backdrop-blur-sm">
            Create your first habit
          </span>
          <span className="bg-purple-500/10 text-purple-300 px-3 py-2 rounded-full border border-purple-500/20 backdrop-blur-sm">
            Set achievable goals
          </span>
        </div>
      </div>
    );
  }

  const completedCount = habits.filter(h => h.completed).length;
  const pendingCount = habits.filter(h => !h.completed).length;
  const completionRate = Math.round((completedCount / habits.length) * 100);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Enhanced List Header */}
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          {/* Left Section - Title and Count */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center backdrop-blur-sm">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="absolute -inset-2 bg-blue-500/10 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                Habit Overview
                <span className="bg-slate-700/60 text-slate-200 text-sm px-3 py-1 rounded-full border border-slate-600/50 backdrop-blur-sm font-medium">
                  {habits.length} {habits.length === 1 ? 'Habit' : 'Habits'}
                </span>
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Track your daily progress and build consistency
              </p>
            </div>
          </div>

          {/* Right Section - Progress Stats */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Completion Rate */}
            <div className="text-center">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg shadow-green-500/25"></div>
                <span className="text-2xl font-bold text-white">{completionRate}%</span>
              </div>
              <span className="text-xs text-slate-400 font-medium">Completion Rate</span>
            </div>

            {/* Completed Habits */}
            <div className="text-center">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-500/25"></div>
                <span className="text-2xl font-bold text-green-400">{completedCount}</span>
              </div>
              <span className="text-xs text-slate-400 font-medium">Completed</span>
            </div>

            {/* Pending Habits */}
            <div className="text-center">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 bg-blue-400 rounded-full shadow-lg shadow-blue-500/25"></div>
                <span className="text-2xl font-bold text-blue-400">{pendingCount}</span>
              </div>
              <span className="text-xs text-slate-400 font-medium">Pending</span>
            </div>

            {/* Streak Info */}
            <div className="text-center">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"/>
                </svg>
                <span className="text-2xl font-bold text-orange-400">
                  {Math.max(...habits.map(h => h.streak || 0))}
                </span>
              </div>
              <span className="text-xs text-slate-400 font-medium">Best Streak</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
            <span>Overall Progress</span>
            <span>{completedCount} of {habits.length} habits completed</span>
          </div>
          <div className="w-full h-2.5 bg-slate-700/50 rounded-full overflow-hidden border border-slate-600/30 backdrop-blur-sm">
            <div 
              className="h-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-green-500/30"
              style={{ width: `${(completedCount / habits.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Habits Grid */}
      <div className="grid gap-4">
        {habits.map((habit, index) => (
          <div
            key={habit._id}
            className="stagger-item transform transition-all duration-500 hover:scale-[1.01]"
            style={{ 
              animationDelay: `${index * 75}ms`,
              animationFillMode: 'both'
            }}
          >
            <HabitItem
              habit={habit}
              onToggle={() => onToggle(habit._id)}
              onDelete={() => onDelete(habit._id)}
            />
          </div>
        ))}
      </div>

      {/* Enhanced List Footer */}
      {habits.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-300">
                <span className="font-semibold">{completionRate}%</span> completion rate
              </span>
            </div>
            <div className="w-px h-4 bg-slate-600/50"></div>
            <div className="text-sm text-slate-400">
              {habits.length} total habits
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span>Continue building momentum</span>
          </div>
        </div>
      )}
    </div>
  );
}