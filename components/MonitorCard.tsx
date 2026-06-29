"use client";

import { useEffect, useState } from "react";
import StatusBadge from "./StatusBadge";
import ResponseChart from "./ResponseChart";

interface Monitor {
  _id: string;
  name: string;
  url: string;
  lastStatus: "UP" | "DOWN" | "UNKNOWN";
  lastCheckedAt?: string;
  interval: number;
  isActive: boolean;
}

interface Check {
  checkedAt: string;
  responseTime: number;
  status: "UP" | "DOWN";
}

interface Props {
  monitor: Monitor;
  onDelete: (id: string) => void;
  onToggle: (id: string, isActive: boolean) => void;
}

export default function MonitorCard({ monitor, onDelete, onToggle }: Props) {
  const [checks, setChecks] = useState<Check[]>([]);
  const [uptime, setUptime] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(`/api/checks?monitorId=${monitor._id}&hours=24`)
      .then((r) => r.json())
      .then((data: Check[]) => {
        setChecks(data);
        if (data.length > 0) {
          const up = data.filter((c) => c.status === "UP").length;
          setUptime(Math.round((up / data.length) * 100 * 10) / 10);
        }
      });
  }, [monitor._id]);

  async function handleDelete() {
    if (!confirm(`Delete "${monitor.name}"?`)) return;
    setDeleting(true);
    await fetch(`/api/monitors/${monitor._id}`, { method: "DELETE" });
    onDelete(monitor._id);
  }

  const lastCheck = monitor.lastCheckedAt
    ? new Date(monitor.lastCheckedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "Never";

  const avgResponseTime =
    checks.length > 0
      ? Math.round(checks.filter((c) => c.status === "UP").reduce((s, c) => s + c.responseTime, 0) /
          Math.max(checks.filter((c) => c.status === "UP").length, 1))
      : null;

  return (
    <div className="bg-slate-800 border border-slate-700/50 rounded-xl p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold truncate">{monitor.name}</h3>
            <StatusBadge status={monitor.lastStatus} />
          </div>
          <a
            href={monitor.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-slate-400 hover:text-blue-400 truncate block mt-0.5"
          >
            {monitor.url}
          </a>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onToggle(monitor._id, !monitor.isActive)}
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
              monitor.isActive
                ? "border-slate-600 text-slate-400 hover:border-slate-500"
                : "border-blue-500/40 text-blue-400 hover:border-blue-400"
            }`}
          >
            {monitor.isActive ? "Pause" : "Resume"}
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-xs px-2.5 py-1 rounded-full border border-red-500/30 text-red-400 hover:border-red-400 transition-colors disabled:opacity-40"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xs text-slate-500 mb-0.5">Uptime 24h</p>
          <p className="text-sm font-semibold">
            {uptime !== null ? `${uptime}%` : "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-0.5">Avg response</p>
          <p className="text-sm font-semibold">
            {avgResponseTime !== null ? `${avgResponseTime}ms` : "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-0.5">Last check</p>
          <p className="text-sm font-semibold">{lastCheck}</p>
        </div>
      </div>

      <ResponseChart checks={checks} />
    </div>
  );
}
