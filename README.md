# PingWatch

Uptime monitoring platform — add URLs, get pinged every 5 minutes, receive email alerts when they go down.

## Stack

- **Frontend** — Next.js 14 (App Router), TypeScript, Tailwind CSS, Recharts
- **Backend** — Next.js API Routes, node-cron, Nodemailer
- **Database** — MongoDB + Mongoose
- **DevOps** — Docker, Docker Compose, GitHub Actions

## Features

- JWT authentication (register / login)
- Add and manage URL monitors
- Automatic ping every 5 minutes via cron job
- Response time history with 24h chart
- Uptime percentage tracking
- Email alerts on DOWN and recovery

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Fill in MONGODB_URI, JWT_SECRET, and SMTP credentials

# 3. Run in development
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `SMTP_HOST` | SMTP server host |
| `SMTP_PORT` | SMTP server port (default 587) |
| `SMTP_USER` | SMTP username / email |
| `SMTP_PASS` | SMTP password or app password |
| `EMAIL_FROM` | Sender name and address |
| `NEXT_PUBLIC_APP_URL` | Public URL of the app |

## Docker

```bash
# Copy and fill .env first
docker compose up -d
```

This starts the Next.js app and a MongoDB instance.

## Project structure

```
app/
  api/
    auth/          # register, login, logout
    monitors/      # CRUD monitors
    checks/        # ping history
  dashboard/       # main UI
  login/
  register/
components/        # Navbar, MonitorCard, ResponseChart, StatusBadge, AddMonitorModal
lib/               # mongodb, auth, cron, email
models/            # User, Monitor, Check
middleware.ts      # route protection
instrumentation.ts # cron job startup
```
