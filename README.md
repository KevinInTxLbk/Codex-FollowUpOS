# FollowUpOS

FollowUpOS is a production-grade outreach operating system for agencies. It provides a deterministic local setup, a shared data model, and a clean console for managing agencies, clients, leads, campaigns, outcomes, and outbound messaging.

## Architecture

- **apps/api**: Express HTTP API for CRUD operations and health diagnostics.
- **apps/web**: Next.js web console (port-locked to `3001`).
- **apps/worker**: BullMQ worker for background message delivery (no HTTP listener).
- **packages/common**: Shared Prisma schema, client, queue contracts, providers, and utilities.

## Prerequisites

- Node.js 20+
- Redis (for BullMQ queues)
- SQLite (default local Prisma provider)

## Deterministic configuration invariants

- API must run on port **3000**.
- Web must run on port **3001** (locked via `cross-env` in `apps/web/package.json`).
- Web -> API base URL is fixed in `apps/web/src/lib/config.ts`.
- All web API calls must use `apps/web/src/lib/apiFetch.ts`.

## Setup (PowerShell)

```powershell
npm install
```

### Configure the database

```powershell
$env:DATABASE_URL="file:./packages/common/prisma/dev.db"
```

### Generate Prisma client and run migrations

```powershell
npm --workspace packages/common run prisma:generate
npm --workspace packages/common run prisma:migrate
```

### Seed baseline data

```powershell
npm --workspace packages/common run seed
```

### Run the services

```powershell
npm --workspace apps/api run dev
npm --workspace apps/web run dev
npm --workspace apps/worker run dev
```

## Troubleshooting

- **Port checks**

```powershell
Get-NetTCPConnection -LocalPort 3000
Get-NetTCPConnection -LocalPort 3001
```

- **Find configuration references**

```powershell
Get-ChildItem -Recurse -File | Select-String -Pattern "API_BASE_URL"
```

- **Health endpoint**

```powershell
Invoke-RestMethod http://localhost:3000/health
```

## Product overview

FollowUpOS enables agencies to:

- Manage agencies, users, clients, and leads.
- Define outcomes and campaigns.
- Queue outbound messages (SMS + email abstraction).
- Track message lifecycle attempts and agent decisions.
- Monitor deterministic diagnostics via `/health` and the web console.
