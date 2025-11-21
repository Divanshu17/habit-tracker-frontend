import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-280px)] flex items-center justify-center py-12 px-4">
      <div className="text-center space-y-8 animate-fade-in">
        {/* 404 Icon */}
        <div className="text-9xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-float">
          404
        </div>

        {/* Title */}
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Oops! Page Not Found
          </h1>
          <p className="text-lg text-slate-400 max-w-md mx-auto">
            The habit you're looking for doesn't exist. Let's get you back on
            track with your daily routine.
          </p>
        </div>

        {/* Illustration */}
        <div className="py-8">
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center text-6xl">
            🚀
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-green-500/30 active:scale-95"
          >
            <span>←</span>
            Back to Tracker
          </Link>
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  );
}
