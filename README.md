# Ken's Life

Ken's Life is Kenneth Lutz's standalone master operating dashboard. It aggregates Personal OS, Primeva, and Three Rivers without replacing their existing hosted frontends.

## Source-of-truth architecture

- **Personal**: reads/writes the Personal OS Supabase project using the authenticated user's RLS-protected records.
- **Primeva**: reads/writes the current authoritative `primeva` schema. Primeva Labs and Primeva Health stay separated for CRM and Content. CEO Overview is aggregate-only.
- **Three Rivers**: remains in the separate Three Rivers Supabase project. Ken's Life uses the owner-scoped `kens-life-three-rivers` Edge Function bridge; it never exposes a Three Rivers service credential to the browser.
- **Calendar**: uses the existing Apple Calendar integration and the four iCloud calendars: Personal, Primeva Labs, Primeva Health, and Three Rivers.

## Safety boundary

Ken's Life does **not** provide delete actions. The AI Brief is advisory only: it can prioritize and summarize but has no send, delete, approval, or autonomous external-action pathway.

## Navigation

### Home
- What should I do today? + AI Brief
- All Tasks
- Unified Calendar

### Personal
- Health
- Finance
- Life

### Primeva
- CEO Overview
- Tasks
- Finance
- Primeva Labs → Labs CRM, Labs Content
- Primeva Health → Health CRM, Health Content

### Three Rivers
- Today
- Active Accounts
- Pipeline
- Tasks
- Route
- Panels & Codes
- Payors

## Existing dashboards

Personal OS, Primeva OS, and Three Rivers Territory OS remain separate deployments and are intentionally retained as backups/specialized interfaces.
