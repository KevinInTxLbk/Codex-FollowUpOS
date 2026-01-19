import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { z } from "zod";
import { Queue } from "bullmq";
import {
  prisma,
  MESSAGES_QUEUE_NAME,
  SEND_MESSAGE_JOB_NAME,
  getRedisConnection,
  sendMessageJobSchema,
} from "@followupos/common";
import {
  Prisma,
  MessageChannel,
  MessageStatus,
  OutcomeStatus,
  AgentDecisionType,
} from "@prisma/client";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3001",
  }),
);

const messageQueue = new Queue(MESSAGES_QUEUE_NAME, {
  connection: getRedisConnection(),
});

const success = <T>(res: Response, data: T) => res.json({ ok: true, data });

class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public status = 400,
    public details?: unknown,
  ) {
    super(message);
  }
}

const asyncHandler =
  (handler: (req: Request, res: Response) => Promise<Response | void>) =>
  (req: Request, res: Response, next: NextFunction) =>
    handler(req, res).catch(next);

const parse = <T>(schema: z.ZodSchema<T>, payload: unknown): T => {
  const result = schema.safeParse(payload);
  if (!result.success) {
    throw new ApiError("Validation failed", "VALIDATION_ERROR", 400, result.error.flatten());
  }
  return result.data;
};

app.get(
  "/health",
  (_req, res) =>
    success(res, {
      service: "api",
      port: 3000,
      expectedPort: 3000,
      expectedWebBaseUrl: "http://localhost:3001",
      nodeEnv: process.env.NODE_ENV ?? "development",
    }),
);

const agencySchema = z.object({
  name: z.string().min(1),
});

app.post(
  "/agencies",
  asyncHandler(async (req, res) => {
    const data = parse(agencySchema, req.body);
    const agency = await prisma.agency.create({ data });
    return success(res, agency);
  }),
);

app.get(
  "/agencies",
  asyncHandler(async (_req, res) => {
    const agencies = await prisma.agency.findMany({ orderBy: { createdAt: "desc" } });
    return success(res, agencies);
  }),
);

app.get(
  "/agencies/:id",
  asyncHandler(async (req, res) => {
    const agency = await prisma.agency.findUnique({ where: { id: req.params.id } });
    if (!agency) {
      throw new ApiError("Agency not found", "NOT_FOUND", 404);
    }
    return success(res, agency);
  }),
);

app.put(
  "/agencies/:id",
  asyncHandler(async (req, res) => {
    const data = parse(agencySchema, req.body);
    const agency = await prisma.agency.update({ where: { id: req.params.id }, data });
    return success(res, agency);
  }),
);

app.delete(
  "/agencies/:id",
  asyncHandler(async (req, res) => {
    await prisma.agency.delete({ where: { id: req.params.id } });
    return success(res, { id: req.params.id });
  }),
);

const userSchema = z.object({
  agencyId: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1),
  role: z.string().min(1),
});

app.post(
  "/users",
  asyncHandler(async (req, res) => {
    const data = parse(userSchema, req.body);
    const user = await prisma.user.create({ data });
    return success(res, user);
  }),
);

app.get(
  "/users",
  asyncHandler(async (_req, res) => {
    const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
    return success(res, users);
  }),
);

app.get(
  "/users/:id",
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) {
      throw new ApiError("User not found", "NOT_FOUND", 404);
    }
    return success(res, user);
  }),
);

app.put(
  "/users/:id",
  asyncHandler(async (req, res) => {
    const data = parse(userSchema, req.body);
    const user = await prisma.user.update({ where: { id: req.params.id }, data });
    return success(res, user);
  }),
);

app.delete(
  "/users/:id",
  asyncHandler(async (req, res) => {
    await prisma.user.delete({ where: { id: req.params.id } });
    return success(res, { id: req.params.id });
  }),
);

const clientSchema = z.object({
  agencyId: z.string().uuid(),
  name: z.string().min(1),
  industry: z.string().min(1),
});

app.post(
  "/clients",
  asyncHandler(async (req, res) => {
    const data = parse(clientSchema, req.body);
    const client = await prisma.client.create({ data });
    return success(res, client);
  }),
);

app.get(
  "/clients",
  asyncHandler(async (_req, res) => {
    const clients = await prisma.client.findMany({ orderBy: { createdAt: "desc" } });
    return success(res, clients);
  }),
);

app.get(
  "/clients/:id",
  asyncHandler(async (req, res) => {
    const client = await prisma.client.findUnique({ where: { id: req.params.id } });
    if (!client) {
      throw new ApiError("Client not found", "NOT_FOUND", 404);
    }
    return success(res, client);
  }),
);

app.put(
  "/clients/:id",
  asyncHandler(async (req, res) => {
    const data = parse(clientSchema, req.body);
    const client = await prisma.client.update({ where: { id: req.params.id }, data });
    return success(res, client);
  }),
);

app.delete(
  "/clients/:id",
  asyncHandler(async (req, res) => {
    await prisma.client.delete({ where: { id: req.params.id } });
    return success(res, { id: req.params.id });
  }),
);

const leadSchema = z.object({
  agencyId: z.string().uuid(),
  clientId: z.string().uuid(),
  fullName: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().min(6).optional(),
  status: z.string().min(1),
});

app.post(
  "/leads",
  asyncHandler(async (req, res) => {
    const data = parse(leadSchema, req.body);
    const lead = await prisma.lead.create({ data });
    return success(res, lead);
  }),
);

app.get(
  "/leads",
  asyncHandler(async (_req, res) => {
    const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });
    return success(res, leads);
  }),
);

app.get(
  "/leads/:id",
  asyncHandler(async (req, res) => {
    const lead = await prisma.lead.findUnique({ where: { id: req.params.id } });
    if (!lead) {
      throw new ApiError("Lead not found", "NOT_FOUND", 404);
    }
    return success(res, lead);
  }),
);

app.put(
  "/leads/:id",
  asyncHandler(async (req, res) => {
    const data = parse(leadSchema, req.body);
    const lead = await prisma.lead.update({ where: { id: req.params.id }, data });
    return success(res, lead);
  }),
);

app.delete(
  "/leads/:id",
  asyncHandler(async (req, res) => {
    await prisma.lead.delete({ where: { id: req.params.id } });
    return success(res, { id: req.params.id });
  }),
);

const campaignSchema = z.object({
  agencyId: z.string().uuid(),
  clientId: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().min(1),
});

app.post(
  "/campaigns",
  asyncHandler(async (req, res) => {
    const data = parse(campaignSchema, req.body);
    const campaign = await prisma.campaign.create({ data });
    return success(res, campaign);
  }),
);

app.get(
  "/campaigns",
  asyncHandler(async (_req, res) => {
    const campaigns = await prisma.campaign.findMany({ orderBy: { createdAt: "desc" } });
    return success(res, campaigns);
  }),
);

app.get(
  "/campaigns/:id",
  asyncHandler(async (req, res) => {
    const campaign = await prisma.campaign.findUnique({ where: { id: req.params.id } });
    if (!campaign) {
      throw new ApiError("Campaign not found", "NOT_FOUND", 404);
    }
    return success(res, campaign);
  }),
);

app.put(
  "/campaigns/:id",
  asyncHandler(async (req, res) => {
    const data = parse(campaignSchema, req.body);
    const campaign = await prisma.campaign.update({ where: { id: req.params.id }, data });
    return success(res, campaign);
  }),
);

app.delete(
  "/campaigns/:id",
  asyncHandler(async (req, res) => {
    await prisma.campaign.delete({ where: { id: req.params.id } });
    return success(res, { id: req.params.id });
  }),
);

const outcomeSchema = z.object({
  agencyId: z.string().uuid(),
  leadId: z.string().uuid(),
  campaignId: z.string().uuid(),
  name: z.string().min(1),
  status: z.nativeEnum(OutcomeStatus),
  successRule: z.record(z.unknown()),
});

app.post(
  "/outcomes",
  asyncHandler(async (req, res) => {
    const data = parse(outcomeSchema, req.body);
    const outcome = await prisma.outcome.create({ data });
    return success(res, outcome);
  }),
);

app.get(
  "/outcomes",
  asyncHandler(async (_req, res) => {
    const outcomes = await prisma.outcome.findMany({ orderBy: { createdAt: "desc" } });
    return success(res, outcomes);
  }),
);

app.get(
  "/outcomes/:id",
  asyncHandler(async (req, res) => {
    const outcome = await prisma.outcome.findUnique({ where: { id: req.params.id } });
    if (!outcome) {
      throw new ApiError("Outcome not found", "NOT_FOUND", 404);
    }
    return success(res, outcome);
  }),
);

app.put(
  "/outcomes/:id",
  asyncHandler(async (req, res) => {
    const data = parse(outcomeSchema, req.body);
    const outcome = await prisma.outcome.update({ where: { id: req.params.id }, data });
    return success(res, outcome);
  }),
);

app.delete(
  "/outcomes/:id",
  asyncHandler(async (req, res) => {
    await prisma.outcome.delete({ where: { id: req.params.id } });
    return success(res, { id: req.params.id });
  }),
);

const messageSchema = z.object({
  agencyId: z.string().uuid(),
  leadId: z.string().uuid(),
  campaignId: z.string().uuid(),
  channel: z.nativeEnum(MessageChannel),
  subject: z.string().optional(),
  body: z.string().min(1),
});

app.post(
  "/messages",
  asyncHandler(async (req, res) => {
    const data = parse(messageSchema, req.body);
    const message = await prisma.message.create({
      data: {
        ...data,
        status: MessageStatus.PENDING,
      },
    });

    await messageQueue.add(
      SEND_MESSAGE_JOB_NAME,
      sendMessageJobSchema.parse({ messageId: message.id }),
    );

    return success(res, message);
  }),
);

app.get(
  "/messages",
  asyncHandler(async (_req, res) => {
    const messages = await prisma.message.findMany({ orderBy: { createdAt: "desc" } });
    return success(res, messages);
  }),
);

app.get(
  "/messages/:id",
  asyncHandler(async (req, res) => {
    const message = await prisma.message.findUnique({ where: { id: req.params.id } });
    if (!message) {
      throw new ApiError("Message not found", "NOT_FOUND", 404);
    }
    return success(res, message);
  }),
);

const agentDecisionSchema = z.object({
  agencyId: z.string().uuid(),
  agentId: z.string().uuid(),
  leadId: z.string().uuid(),
  campaignId: z.string().uuid(),
  decision: z.nativeEnum(AgentDecisionType),
  reasoning: z.string().min(1),
  confidence: z.number().min(0).max(1),
  snapshot: z.record(z.unknown()),
});

app.post(
  "/agent-decision-logs",
  asyncHandler(async (req, res) => {
    const data = parse(agentDecisionSchema, req.body);
    const log = await prisma.agentDecisionLog.create({ data });
    return success(res, log);
  }),
);

app.get(
  "/agent-decision-logs",
  asyncHandler(async (req, res) => {
    const filters = z
      .object({
        agencyId: z.string().uuid().optional(),
        agentId: z.string().uuid().optional(),
        leadId: z.string().uuid().optional(),
        campaignId: z.string().uuid().optional(),
      })
      .parse(req.query);

    const logs = await prisma.agentDecisionLog.findMany({
      where: {
        agencyId: filters.agencyId,
        agentId: filters.agentId,
        leadId: filters.leadId,
        campaignId: filters.campaignId,
      },
      orderBy: { createdAt: "desc" },
    });

    return success(res, logs);
  }),
);

app.use(
  (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof ApiError) {
      return res.status(err.status).json({
        ok: false,
        error: { message: err.message, code: err.code, details: err.details },
      });
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return res.status(404).json({
        ok: false,
        error: { message: "Resource not found", code: "NOT_FOUND" },
      });
    }

    console.error("Unhandled error", err);
    return res.status(500).json({
      ok: false,
      error: { message: "Internal server error", code: "INTERNAL_ERROR" },
    });
  },
);

const PORT = Number(process.env.PORT ?? 3000);
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`API listening on ${PORT}`);
  });
}

export { app };
