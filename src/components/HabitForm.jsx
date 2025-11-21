import React, { useState } from "react";
import { createHabit } from "../api/habits";

export default function HabitForm({ onCreated }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      setLoading(true);
      await createHabit(name.trim());
      setName("");
      if (onCreated) onCreated();
    } catch (err) {
      console.error(err);
      alert("Error creating habit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="relative">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter habit name"
          className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-600 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
        />
      </div>
      <button
        type="submit"
        disabled={loading || !name.trim()}
        className="w-full px-4 py-3 rounded-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all duration-200 hover:shadow-lg hover:shadow-green-500/30"
      >
        {loading ? "Adding..." : "Add Habit"}
      </button>
    </form>
  );
}
