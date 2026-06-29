import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getUserFromRequest } from "@/lib/auth";
import Monitor from "@/models/Monitor";
import Check from "@/models/Check";

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const monitorId = searchParams.get("monitorId");
  const hours = Number(searchParams.get("hours") ?? "24");

  if (!monitorId) {
    return NextResponse.json({ error: "monitorId is required" }, { status: 400 });
  }

  await connectDB();

  const monitor = await Monitor.findOne({ _id: monitorId, userId: user.userId });
  if (!monitor) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const since = new Date(Date.now() - hours * 60 * 60 * 1000);
  const checks = await Check.find({ monitorId, checkedAt: { $gte: since } })
    .sort({ checkedAt: 1 })
    .limit(500);

  return NextResponse.json(checks);
}
