import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getUserFromRequest } from "@/lib/auth";
import Monitor from "@/models/Monitor";
import Check from "@/models/Check";

type Params = { params: { id: string } };

async function getOwnedMonitor(req: NextRequest, id: string) {
  const user = getUserFromRequest(req);
  if (!user) return null;
  await connectDB();
  return Monitor.findOne({ _id: id, userId: user.userId });
}

export async function GET(req: NextRequest, { params }: Params) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const monitor = await getOwnedMonitor(req, params.id);
  if (!monitor) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(monitor);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const monitor = await getOwnedMonitor(req, params.id);
  if (!monitor) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { name, url, interval, isActive } = await req.json();
  if (name !== undefined) monitor.name = name;
  if (url !== undefined) monitor.url = url;
  if (interval !== undefined) monitor.interval = interval;
  if (isActive !== undefined) monitor.isActive = isActive;

  await monitor.save();
  return NextResponse.json(monitor);
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const monitor = await getOwnedMonitor(req, params.id);
  if (!monitor) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await Promise.all([
    monitor.deleteOne(),
    Check.deleteMany({ monitorId: params.id }),
  ]);

  return NextResponse.json({ message: "Deleted" });
}
