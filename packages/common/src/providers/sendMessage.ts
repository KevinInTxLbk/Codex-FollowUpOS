import { MessageChannel } from "@prisma/client";
import { OutboundMessage, ProviderResult } from "./types";

const buildProviderMsgId = (messageId: string) => `prov_${messageId}`;

export const sendOutboundMessage = async (
  message: OutboundMessage,
): Promise<ProviderResult> => {
  const baseResponse = {
    messageId: message.id,
    channel: message.channel,
  };

  if (message.channel === MessageChannel.SMS) {
    return {
      provider: "sms-stub",
      providerMsgId: buildProviderMsgId(message.id),
      fromAddress: "+15551230000",
      rawResponse: {
        ...baseResponse,
        to: message.toPhone,
        accepted: true,
      },
    };
  }

  return {
    provider: "email-stub",
    providerMsgId: buildProviderMsgId(message.id),
    fromAddress: "noreply@followupos.local",
    rawResponse: {
      ...baseResponse,
      to: message.toEmail,
      accepted: true,
    },
  };
};
