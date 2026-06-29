"use client";

import { useEffect, useState, useCallback } from "react";
import MonitorCard from "@/components/MonitorCard";
import AddMonitorModal from "@/components/AddMonitorModal";

interface Monitor {
  _id: string;
  name: string;
  url: string;
  lastStatus: "UP" | "DOWN" | "UNKNOWN";
  lastCheckedAt?: string;
  interval: number;
  isActive: boolean;
}

export default function DashboardPage() {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchMonitors = useCallback(async () => {
    const res = await fetch("/api/monitors");
    const data = await res.json();
    setMonitors(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMonitors();
    const interval = setInterval(fetchMonitors, 30_000);
    return () => clearInterval(interval);
  }, [fetchMonitors]);

  function handleDelete(id: string) {
    setMonitors((prev) => prev.filter((m) => m._id !== id));
  }

  async function handleToggle(id: string, isActive: boolean) {
    await fetch(`/api/monitors/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive }),
    });
    setMonitors((prev) =>
      prev.map((m) => (m._id === id ? { ...m, isActive } : m))
    );
  }

  const upCount = monitors.filter((m) => m.lastStatus === "UP").length;
  const downCount = monitors.filter((m) => m.lastStatus === "DOWN").length;

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Monitors</h1>
          {monitors.length > 0 && (
            <p className="text-slate-400 text-sm mt-1">
              <span className="text-green-400 font-medium">{upCount} up</span>
              {downCount > 0 && (
                <>, <span className="text-red-400 font-medium">{downCount} down</span></>
              )}
              {" "}· {monitors.length} total
            </p>
          )}
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-500 transition-colors px-4 py-2 rounded-lg text-sm font-medium"
        >
          + Add monitor
        </button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-slate-800 rounded-xl h-52 animate-pulse" />
          ))}
        </div>
      ) : monitors.length === 0 ? (
        <div className="text-center py-24 text-slate-500">
          <p className="text-4xl mb-3">📡</p>
          <p className="font-medium">No monitors yet</p>
          <p className="text-sm mt-1">Add your first URL to start monitoring</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 bg-blue-600 hover:bg-blue-500 transition-colors px-4 py-2 rounded-lg text-sm font-medium text-white"
          >
            Add monitor
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {monitors.map((monitor) => (
            <MonitorCard
              key={monitor._id}
              monitor={monitor}
              onDelete={handleDelete}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}

      {showModal && (
        <AddMonitorModal
          onClose={() => setShowModal(false)}
          onCreated={fetchMonitors}
        />
      )}
    </main>
  );
}
