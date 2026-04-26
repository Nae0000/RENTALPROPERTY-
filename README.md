# Rental Property Management WebApp

Production-ready starter for a premium rental property management platform.

## Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- NextAuth (JWT strategy)
- Zod validation

## Quick Start
1. Copy `.env.example` to `.env` and set values.
2. Install dependencies: `npm install`
3. Generate Prisma client: `npm run prisma:generate`
4. Run migrations: `npm run prisma:migrate`
5. Start dev server: `npm run dev`

## Environment Setup (Required)
The app requires a PostgreSQL connection before dashboard pages can load.

1. Create `.env` from template:
   - Windows PowerShell: `Copy-Item .env.example .env`
2. Set at least:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
3. Example:
   - `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/rental_property?schema=public"`
   - `NEXTAUTH_URL="http://localhost:3000"`

## Getting Started Guide (User Manual)

### 1) First login and dashboard
1. Open the app URL from terminal (`http://localhost:3000` or fallback port).
2. Enter via Login page.
3. You will land on `Dashboard` with KPI cards and trend chart.

### 2) Add tenant with one-click flow
1. Go to `Onboarding`.
2. Fill room, tenant, rent, and deposit fields.
3. Click `Create Tenant + Lease + Invoice`.
4. System auto-creates tenant, active lease, first invoice, and updates room occupancy.

### 3) Manage income
1. Go to `Income`.
2. Use filters (`status`, `search`, `sort`) to find invoice records.
3. In `Mark Payment`, select invoice and submit amount.
4. Invoice status updates automatically (`PARTIAL` or `PAID`).

### 4) Manage expenses
1. Go to `Expenses`.
2. Add new expense from `Add Expense`.
3. Filter/search/sort and paginate records from the list.

### 5) Manage calendar events
1. Go to `Calendar`.
2. Create events with type/date/status.
3. Filter/search/sort and paginate event records.

### 6) Reports and sync
1. Go to `Reports`.
2. Check net cashflow, occupancy, and monthly trend.
3. Click `Sync Now` to queue Google Sheets sync job.

## Deploy and GitHub Publish Guide

### A) Publish this code to GitHub
1. Initialize git and commit:
   - `git init`
   - `git add .`
   - `git commit -m "Initial rental property webapp"`
2. Link remote repository:
   - `git remote add origin https://github.com/Nae0000/RENTALPROPERTY-.git`
3. Push to GitHub:
   - `git branch -M main`
   - `git push -u origin main`

### Auto Push After Every Commit
- This project is configured locally with a `post-commit` git hook.
- Result: every successful `git commit` will automatically run `git push origin <current-branch>`.
- Skip one time (if needed):
  - PowerShell: `$env:SKIP_AUTO_PUSH=1; git commit -m "message"`

### Auto Commit + Auto Push Watcher (Optional)
- Start watcher:
  - `npm run watch:auto-sync`
- Behavior:
  - Watches `src/` changes
  - Debounces edits for ~2.5 seconds
  - Runs `git add -A` -> `git commit` -> `git push origin <current-branch>`
- Notes:
  - Stop watcher with `Ctrl+C`
  - Use only when you are sure frequent auto-commits fit your workflow

### B) Deploy on Vercel (recommended for Next.js)
1. Import repository in Vercel dashboard.
2. Add environment variables from `.env`.
3. Set Build Command: `npm run build`
4. Set Install Command: `npm install` (or `npx pnpm install` if using pnpm lockfile)
5. Deploy.

Quick CLI flow:
- `vercel`
- `vercel env add DATABASE_URL`
- `vercel env add NEXTAUTH_SECRET`
- `vercel env add NEXTAUTH_URL`
- `vercel --prod`

### C) Deploy via Docker (optional)
1. Build image: `docker build -t rental-property-webapp .`
2. Run container with env vars and database access.
3. Expose app port and run migrations before traffic cutover.

Quick local container flow:
- `docker compose up -d --build`
- `docker compose exec app npm run prisma:generate`
- `docker compose exec app npm run prisma:migrate`
- `docker compose exec app npm run seed`
- Open `http://localhost:3000`

## Product Modules
- Dashboard overview
- Room management
- Tenant and lease management
- Income and expense tracking
- Calendar due-date management
- Reports and Google Sheets sync

## Architecture Docs
- `docs/architecture/overview.md`
- `docs/architecture/erd.md`
- `docs/api/openapi-outline.md`
- `docs/ui/ui-architecture.md`
