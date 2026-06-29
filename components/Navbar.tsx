"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <nav className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <span className="font-bold text-lg tracking-tight">
          Ping<span className="text-blue-400">Watch</span>
        </span>
        <button
          onClick={logout}
          className="text-sm text-slate-400 hover:text-slate-100 transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
