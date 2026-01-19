import { MessageChannel, MessageStatus, OutcomeStatus, AgentDecisionType, AttemptStatus } from "@prisma/client";
import { prisma } from "./prisma";

const agencyId = "11111111-1111-1111-1111-111111111111";
const userId = "22222222-2222-2222-2222-222222222222";
const clientId = "33333333-3333-3333-3333-333333333333";
const leadId = "44444444-4444-4444-4444-444444444444";
const campaignId = "55555555-5555-5555-5555-555555555555";
const outcomeId = "66666666-6666-6666-6666-666666666666";
const messageId = "77777777-7777-7777-7777-777777777777";
const agentId = "88888888-8888-8888-8888-888888888888";
const decisionLogId = "99999999-9999-9999-9999-999999999999";

const run = async () => {
  await prisma.agency.upsert({
    where: { id: agencyId },
    update: { name: "FollowUpOS Agency" },
    create: { id: agencyId, name: "FollowUpOS Agency" },
  });

  await prisma.user.upsert({
    where: { id: userId },
    update: { name: "Avery Ops", email: "ops@followupos.local", role: "admin" },
    create: {
      id: userId,
      agencyId,
      name: "Avery Ops",
      email: "ops@followupos.local",
      role: "admin",
    },
  });

  await prisma.client.upsert({
    where: { id: clientId },
    update: { name: "Northwind Logistics", industry: "Logistics" },
    create: {
      id: clientId,
      agencyId,
      name: "Northwind Logistics",
      industry: "Logistics",
    },
  });

  await prisma.lead.upsert({
    where: { id: leadId },
    update: {
      fullName: "Jordan Lee",
      email: "jordan.lee@example.com",
      phone: "+15550100001",
      status: "active",
    },
    create: {
      id: leadId,
      agencyId,
      clientId,
      fullName: "Jordan Lee",
      email: "jordan.lee@example.com",
      phone: "+15550100001",
      status: "active",
    },
  });

  await prisma.campaign.upsert({
    where: { id: campaignId },
    update: { name: "Welcome Sequence", description: "Intro outreach for new leads" },
    create: {
      id: campaignId,
      agencyId,
      clientId,
      name: "Welcome Sequence",
      description: "Intro outreach for new leads",
    },
  });

  await prisma.outcome.upsert({
    where: { id: outcomeId },
    update: {
      name: "Demo Scheduled",
      status: OutcomeStatus.PLANNED,
      successRule: { type: "calendar", daysToComplete: 14 },
    },
    create: {
      id: outcomeId,
      agencyId,
      leadId,
      campaignId,
      name: "Demo Scheduled",
      status: OutcomeStatus.PLANNED,
      successRule: { type: "calendar", daysToComplete: 14 },
    },
  });

  await prisma.message.upsert({
    where: { id: messageId },
    update: {
      channel: MessageChannel.EMAIL,
      status: MessageStatus.PENDING,
      subject: "Welcome to Northwind Logistics",
      body: "Hi Jordan, we'd love to schedule a quick intro call.",
    },
    create: {
      id: messageId,
      agencyId,
      leadId,
      campaignId,
      channel: MessageChannel.EMAIL,
      status: MessageStatus.PENDING,
      subject: "Welcome to Northwind Logistics",
      body: "Hi Jordan, we'd love to schedule a quick intro call.",
    },
  });

  await prisma.agent.upsert({
    where: { id: agentId },
    update: { name: "FollowUpOS Agent", role: "outreach" },
    create: {
      id: agentId,
      agencyId,
      name: "FollowUpOS Agent",
      role: "outreach",
    },
  });

  await prisma.agentDecisionLog.upsert({
    where: { id: decisionLogId },
    update: {
      decision: AgentDecisionType.PRIORITIZE,
      reasoning: "Lead responded positively in prior campaign.",
      confidence: 0.86,
      snapshot: { leadStatus: "active", lastTouchpoint: "email" },
    },
    create: {
      id: decisionLogId,
      agencyId,
      agentId,
      leadId,
      campaignId,
      decision: AgentDecisionType.PRIORITIZE,
      reasoning: "Lead responded positively in prior campaign.",
      confidence: 0.86,
      snapshot: { leadStatus: "active", lastTouchpoint: "email" },
    },
  });

  const existingOutcomeAttempt = await prisma.outcomeAttempt.findFirst({
    where: { outcomeId },
  });

  if (!existingOutcomeAttempt) {
    await prisma.outcomeAttempt.create({
      data: {
        outcomeId,
        status: AttemptStatus.PENDING,
        details: { note: "Awaiting scheduling confirmation" },
      },
    });
  }

  console.log("Seed complete", {
    agencyId,
    userId,
    clientId,
    leadId,
    campaignId,
    outcomeId,
    messageId,
    agentId,
    decisionLogId,
  });
};

run()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
