import { Job, Worker } from "bullmq";
import {
  prisma,
  MESSAGES_QUEUE_NAME,
  SEND_MESSAGE_JOB_NAME,
  getRedisConnection,
  sendMessageJobSchema,
  sendOutboundMessage,
} from "@followupos/common";
import { AttemptStatus, MessageStatus } from "@prisma/client";

const SENDING_STALE_MS = 5 * 60 * 1000;

const log = (message: string, details?: Record<string, unknown>) => {
  const payload = { message, ...details, timestamp: new Date().toISOString() };
  console.log(JSON.stringify(payload));
};

const processSendMessage = async (job: Job) => {
  if (job.name !== SEND_MESSAGE_JOB_NAME) {
    log("Unknown job name", { jobName: job.name });
    return;
  }

  const payload = sendMessageJobSchema.parse(job.data);
  const message = await prisma.message.findUnique({
    where: { id: payload.messageId },
    include: { lead: true },
  });

  if (!message) {
    log("Message not found", { messageId: payload.messageId });
    return;
  }

  if (message.status === MessageStatus.SENT) {
    log("Message already sent", { messageId: message.id });
    return;
  }

  const staleBefore = new Date(Date.now() - SENDING_STALE_MS);
  const claimResult = await prisma.message.updateMany({
    where: {
      id: message.id,
      OR: [
        { status: { in: [MessageStatus.PENDING, MessageStatus.FAILED] } },
        { status: MessageStatus.SENDING, updatedAt: { lt: staleBefore } },
      ],
    },
    data: { status: MessageStatus.SENDING },
  });

  if (claimResult.count === 0) {
    log("Message already being processed", { messageId: message.id });
    return;
  }

  try {
    const providerResult = await sendOutboundMessage({
      id: message.id,
      channel: message.channel,
      subject: message.subject,
      body: message.body,
      toEmail: message.lead.email,
      toPhone: message.lead.phone,
    });

    await prisma.$transaction([
      prisma.messageAttempt.create({
        data: {
          messageId: message.id,
          status: AttemptStatus.SUCCESS,
          provider: providerResult.provider,
          providerMsgId: providerResult.providerMsgId,
          fromAddress: providerResult.fromAddress,
          rawResponse: providerResult.rawResponse,
        },
      }),
      prisma.message.update({
        where: { id: message.id },
        data: { status: MessageStatus.SENT, sentAt: new Date() },
      }),
    ]);

    log("Message sent", { messageId: message.id });
  } catch (error) {
    await prisma.messageAttempt.create({
      data: {
        messageId: message.id,
        status: AttemptStatus.FAILED,
        provider: "unknown",
        rawResponse: { error: String(error) },
      },
    });

    await prisma.message.update({
      where: { id: message.id },
      data: { status: MessageStatus.FAILED },
    });

    log("Message send failed", { messageId: message.id, error: String(error) });
    throw error;
  }
};

export const startMessagesWorker = () => {
  const worker = new Worker(MESSAGES_QUEUE_NAME, processSendMessage, {
    connection: getRedisConnection(),
  });

  worker.on("failed", (job, err) => {
    log("Job failed", { jobId: job?.id, name: job?.name, error: err.message });
  });

  worker.on("completed", (job) => {
    log("Job completed", { jobId: job.id, name: job.name });
  });

  log("Messages worker started", { queue: MESSAGES_QUEUE_NAME });

  return worker;
};
