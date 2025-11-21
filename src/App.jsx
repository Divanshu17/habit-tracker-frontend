import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 flex flex-col relative overflow-hidden">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {/* Floating gradient orbs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-float opacity-20" />
          <div
            className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-float opacity-20"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute bottom-0 left-1/2 w-96 h-96 bg-green-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-float opacity-20"
            style={{ animationDelay: "4s" }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col flex-1">
          {/* Navbar */}
          <nav className="bg-slate-800/40 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50 animate-slide-in-down">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center animate-gradient group-hover:shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300">
                  <span className="text-white font-bold text-sm">HT</span>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                    Habit Tracker
                  </h1>
                  <span className="text-xs text-slate-500">
                    Build Consistency
                  </span>
                </div>
              </div>
              <p className="hidden sm:block text-sm text-slate-400 hover:text-slate-300 transition-colors duration-300">
                Build better habits daily
              </p>
            </div>
          </nav>

          {/* Main Content with fade-in animation */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 animate-fade-in">
            <div className="max-w-6xl mx-auto">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </main>

          {/* Footer */}
          <footer className="border-t border-slate-700/50 bg-slate-800/30 backdrop-blur-md animate-slide-in-up">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
                {/* Logo Section */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                      <span className="text-white font-bold text-xs">HT</span>
                    </div>
                    <span className="font-semibold">Habit Tracker</span>
                  </div>
                  <p className="text-sm text-slate-400">
                    Track daily habits with visual insights
                  </p>
                </div>

                {/* Quick Links */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-300 mb-3">
                    Quick Links
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li>
                      <a
                        href="/"
                        className="hover:text-green-400 transition-colors duration-200"
                      >
                        Home
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="hover:text-green-400 transition-colors duration-200"
                      >
                        Guide
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="hover:text-green-400 transition-colors duration-200"
                      >
                        Settings
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Stats */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-300 mb-3">
                    Community
                  </h3>
                  <p className="text-sm text-slate-400">
                    Join thousands building better habits daily
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-700/50 pt-6 text-center text-sm text-slate-400 hover:text-slate-300 transition-colors duration-300">
                <p>
                  © 2024 Habit Tracker. Build consistency, one day at a time.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </BrowserRouter>
  );
}
