# System Overview

## Business Goals
- Complete room-to-cash workflow in one place
- One-click onboarding for new tenant
- Fast visibility on delinquent payments and profitability

## Domain Modules
- `core`: properties, rooms, tenants, leases, documents
- `finance`: invoices, payments, deposits, expenses, utility readings
- `planning`: calendar events, reminders, lease expiry
- `reporting`: snapshots, KPI aggregates, external sync jobs

## Core Rules
- One active lease per room
- One rent invoice per room per billing month
- Tenant document must be linked to tenant or lease
- Occupancy is derived from active lease and room status

## Architecture
- Next.js App Router for UI + API routes
- Prisma ORM for database access and migrations
- Service layer in `src/server/services` for business logic
- Input validation via Zod in each API module
- NextAuth with JWT session and role checks
