# Delivery Milestones

## M1: Scaffold + Auth + Prisma bootstrap
- Initialize Next.js app shell and design tokens
- Set up Prisma schema and migration pipeline
- Configure NextAuth JWT baseline with role claims

## M2: Core Domain
- Rooms, tenants, leases, and documents CRUD
- One active lease per room enforcement in services
- Document upload URL flow and storage provider adapter

## M3: Finance and Calendar
- Invoice generation and payment tracking
- Expense and utility reading modules
- Calendar events for rent due and lease expiry

## M4: Reports and Integrations
- Dashboard summary endpoints and trend datasets
- Monthly snapshot generation
- Google Sheets sync job execution and retry strategy

## M5: Hardening and Deployment
- Unit, integration, and e2e test coverage for critical flows
- CI pipeline: lint, typecheck, test, Prisma validate
- Deployment automation with GitHub Actions and environment checks
