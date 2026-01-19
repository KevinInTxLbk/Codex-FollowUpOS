import { MessageChannel } from "@prisma/client";

export type ProviderResult = {
  provider: string;
  providerMsgId: string;
  fromAddress: string;
  rawResponse: Record<string, unknown>;
};

export type OutboundMessage = {
  id: string;
  channel: MessageChannel;
  subject?: string | null;
  body: string;
  toEmail?: string | null;
  toPhone?: string | null;
};
