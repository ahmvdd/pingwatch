import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getUserFromRequest } from "@/lib/auth";
import Monitor from "@/models/Monitor";

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const monitors = await Monitor.find({ userId: user.userId }).sort({ createdAt: -1 });
  return NextResponse.json(monitors);
}

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, url, interval } = await req.json();
  if (!name || !url) {
    return NextResponse.json({ error: "Name and URL are required" }, { status: 400 });
  }

  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  await connectDB();
  const monitor = await Monitor.create({
    userId: user.userId,
    name,
    url,
    interval: interval ?? 5,
  });

  return NextResponse.json(monitor, { status: 201 });
}
