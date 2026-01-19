# FollowUpOS Web Console

The Next.js console provides a customer-ready UI for managing FollowUpOS operations.

## Pages

- **Overview**: Snapshot of agency activity and core counts.
- **Leads**: Lead pipeline monitoring.
- **Clients**: Client account registry.
- **Campaigns**: Campaign playbooks and descriptions.
- **Outcomes**: Outcome tracking for success goals.
- **Messages**: Outbound message lifecycle status.
- **Agent Logs**: Auditable decisions with reasoning and confidence.
- **Diagnostics**: API health and deterministic environment checks.

## API access

All API calls are routed through `src/lib/apiFetch.ts`, which:

- Attaches an API key header when available.
- Sets JSON headers safely.
- Normalizes responses into `{ ok: true | false }`.
- Throws structured errors with `status`, `code`, and `details`.

The API base URL is centralized in `src/lib/config.ts` and must not be overridden via environment variables for local development.
