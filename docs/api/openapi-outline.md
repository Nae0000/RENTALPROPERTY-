# API Outline

## Base
- Base URL: `/api`
- Auth: Bearer JWT (NextAuth session token)
- Response envelope:
  - success: `{ "data": ..., "meta": ... }`
  - error: `{ "error": { "code": "...", "message": "...", "details": ... } }`

## Endpoints

### Rooms
- `GET /rooms?status=&search=&page=&pageSize=`
- `POST /rooms`
- `GET /rooms/:id`
- `PATCH /rooms/:id`
- `DELETE /rooms/:id`

### Tenants
- `GET /tenants?search=`
- `POST /tenants`
- `GET /tenants/:id`
- `PATCH /tenants/:id`
- `POST /tenants/:id/documents/upload-url`

### Leases and Invoices
- `POST /leases`
- `PATCH /leases/:id/terminate`
- `GET /invoices?status=&month=&year=`
- `POST /invoices/generate-monthly`
- `POST /payments`

### Expenses and Utilities
- `GET /expenses?type=&from=&to=`
- `POST /expenses`
- `GET /utilities/readings?roomId=&month=&year=`
- `POST /utilities/readings`

### Calendar and Reports
- `GET /calendar/events?month=&year=`
- `POST /calendar/events`
- `GET /reports/dashboard-summary?month=&year=`
- `GET /reports/monthly-trend?from=&to=`
- `POST /integrations/google-sheets/sync`

## Validation and Reliability
- Request and response schemas with Zod per route module
- Centralized error mapping for validation/database/auth errors
- Idempotency key required for `/integrations/google-sheets/sync`
