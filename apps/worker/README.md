# FollowUpOS Worker

The worker processes background jobs for outbound messaging via BullMQ.

## Queue contracts

- Queue: `messages`
- Job name: `send-message`
- Payload schema: `{ messageId: string (uuid) }`

Contracts are defined in `packages/common/src/queues` and validated with Zod.

## Running the worker

```powershell
npm --workspace apps/worker run dev
```

The worker has no HTTP listener and relies on Redis connectivity.
