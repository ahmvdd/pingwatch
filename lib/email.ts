import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendDownAlert(
  to: string,
  monitorName: string,
  url: string,
  statusCode: number,
  error?: string
) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: `🔴 [PingWatch] ${monitorName} is DOWN`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#ef4444">🔴 Monitor Down Alert</h2>
        <p>Your monitor <strong>${monitorName}</strong> is currently <strong style="color:#ef4444">DOWN</strong>.</p>
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="padding:8px;border:1px solid #e2e8f0"><strong>URL</strong></td><td style="padding:8px;border:1px solid #e2e8f0">${url}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e2e8f0"><strong>Status Code</strong></td><td style="padding:8px;border:1px solid #e2e8f0">${statusCode || "N/A"}</td></tr>
          ${error ? `<tr><td style="padding:8px;border:1px solid #e2e8f0"><strong>Error</strong></td><td style="padding:8px;border:1px solid #e2e8f0">${error}</td></tr>` : ""}
          <tr><td style="padding:8px;border:1px solid #e2e8f0"><strong>Time</strong></td><td style="padding:8px;border:1px solid #e2e8f0">${new Date().toUTCString()}</td></tr>
        </table>
        <p style="margin-top:24px;color:#64748b;font-size:14px">PingWatch — Uptime Monitoring</p>
      </div>
    `,
  });
}

export async function sendUpAlert(
  to: string,
  monitorName: string,
  url: string,
  responseTime: number
) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: `✅ [PingWatch] ${monitorName} is back UP`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#22c55e">✅ Monitor Recovered</h2>
        <p>Your monitor <strong>${monitorName}</strong> is back <strong style="color:#22c55e">UP</strong>.</p>
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="padding:8px;border:1px solid #e2e8f0"><strong>URL</strong></td><td style="padding:8px;border:1px solid #e2e8f0">${url}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e2e8f0"><strong>Response Time</strong></td><td style="padding:8px;border:1px solid #e2e8f0">${responseTime}ms</td></tr>
          <tr><td style="padding:8px;border:1px solid #e2e8f0"><strong>Time</strong></td><td style="padding:8px;border:1px solid #e2e8f0">${new Date().toUTCString()}</td></tr>
        </table>
        <p style="margin-top:24px;color:#64748b;font-size:14px">PingWatch — Uptime Monitoring</p>
      </div>
    `,
  });
}
