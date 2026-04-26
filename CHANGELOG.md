# Changelog

All notable changes to this project are documented in this file.

## v0.1.0 - 2026-04-26

### Added
- Initial production-ready scaffold for rental property management web app.
- Next.js App Router structure with premium dashboard layout and module pages.
- Prisma schema for rooms, tenants, leases, invoices, payments, expenses, calendar, and reports.
- API routes for core modules, onboarding flow, and Google Sheets sync job queue.
- One-click onboarding flow to create tenant, lease, first invoice, and room occupancy update.
- Filtering, sorting, and pagination for income, expenses, and calendar pages.
- CI workflow with lint, typecheck, Prisma validate/generate, and build checks.
- GitHub collaboration templates (PR template + issue templates).
- Deployment assets (`vercel.json`, `Dockerfile`, `docker-compose.yml`).

### Fixed
- Type compatibility issues in API payload handling for JSON and optional relation fields.
- Build-time dashboard data access problems by forcing dynamic rendering where DB access is required.
- Typecheck instability related to stale generated Next type references.

### Notes
- App requires PostgreSQL connection via `DATABASE_URL`.
- Example usage and deploy steps are documented in `README.md`.
