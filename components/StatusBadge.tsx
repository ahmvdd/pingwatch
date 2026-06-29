type Status = "UP" | "DOWN" | "UNKNOWN";

export default function StatusBadge({ status }: { status: Status }) {
  const styles: Record<Status, string> = {
    UP: "bg-green-500/15 text-green-400 border-green-500/30",
    DOWN: "bg-red-500/15 text-red-400 border-red-500/30",
    UNKNOWN: "bg-slate-500/15 text-slate-400 border-slate-500/30",
  };

  const dot: Record<Status, string> = {
    UP: "bg-green-400",
    DOWN: "bg-red-400",
    UNKNOWN: "bg-slate-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot[status]} ${status === "UP" ? "animate-pulse" : ""}`} />
      {status}
    </span>
  );
}
