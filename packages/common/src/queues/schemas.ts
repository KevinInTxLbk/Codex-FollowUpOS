import { z } from "zod";

export const sendMessageJobSchema = z.object({
  messageId: z.string().uuid(),
});

export type SendMessageJobPayload = z.infer<typeof sendMessageJobSchema>;
