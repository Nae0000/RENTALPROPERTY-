# UI Architecture

## Layout System
- Global App Shell: `Sidebar + Topbar + Content`
- Theme: dark/light with CSS variables
- Responsive breakpoints for desktop and mobile

## Route Map
- `/dashboard`: KPI cards and finance charts
- `/rooms`: room cards with status and quick actions
- `/tenants`: tenant list and document states
- `/income`: invoices and payment status
- `/expenses`: expense log by category
- `/calendar`: monthly due-date and lease-expiry events
- `/reports`: trend charts and export controls
- `/onboarding`: one-click tenant onboarding

## Component Groups
- `src/components/dashboard`: KPI and chart widgets
- `src/components/layout`: sidebar, topbar, shell wrappers
- `src/components/rooms`: room card/grid
- `src/components/forms`: onboarding forms and upload widgets
- `src/components/ui`: primitive card/button/badge/table components

## One-click Workflow
1. Create tenant profile
2. Upload contract + ID documents
3. Assign room and lease term
4. Create first invoice automatically

## Design Tokens
- Base colors: black/gray/white + blue accent
- Shadow: soft elevated cards
- Radius: rounded-xl surfaces
- Motion: subtle hover and state transitions
