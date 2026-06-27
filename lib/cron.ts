import cron from "node-cron";
import axios from "axios";
import { connectDB } from "./mongodb";
import Monitor from "../models/Monitor";
import Check from "../models/Check";
import User from "../models/User";
import { sendDownAlert, sendUpAlert } from "./email";

let isRunning = false;

async function pingMonitor(monitor: InstanceType<typeof Monitor>) {
  const start = Date.now();
  let status: "UP" | "DOWN" = "DOWN";
  let statusCode = 0;
  let responseTime = 0;
  let error: string | undefined;

  try {
    const res = await axios.get(monitor.url, {
      timeout: 10000,
      validateStatus: () => true,
    });
    responseTime = Date.now() - start;
    statusCode = res.status;
    status = res.status < 400 ? "UP" : "DOWN";
  } catch (err: unknown) {
    responseTime = Date.now() - start;
    statusCode = 0;
    error = err instanceof Error ? err.message : "Unknown error";
  }

  await Check.create({
    monitorId: monitor._id,
    status,
    statusCode,
    responseTime,
    error,
    checkedAt: new Date(),
  });

  const previousStatus = monitor.lastStatus;

  await Monitor.findByIdAndUpdate(monitor._id, {
    lastStatus: status,
    lastCheckedAt: new Date(),
  });

  if (previousStatus !== "UNKNOWN" && previousStatus !== status) {
    try {
      const user = await User.findById(monitor.userId);
      if (user) {
        if (status === "DOWN") {
          await sendDownAlert(user.email, monitor.name, monitor.url, statusCode, error);
        } else {
          await sendUpAlert(user.email, monitor.name, monitor.url, responseTime);
        }
      }
    } catch (emailErr) {
      console.error(`Failed to send alert for monitor ${monitor._id}:`, emailErr);
    }
  }
}

export function startCronJobs() {
  if (isRunning) return;
  isRunning = true;

  cron.schedule("*/5 * * * *", async () => {
    try {
      await connectDB();
      const monitors = await Monitor.find({ isActive: true });
      await Promise.allSettled(monitors.map(pingMonitor));
    } catch (err) {
      console.error("Cron job error:", err);
    }
  });

  console.log("PingWatch cron jobs started");
}
