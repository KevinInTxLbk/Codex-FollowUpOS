import { describe, it, expect } from "vitest";
import { sendMessageJobSchema } from "../src/queues/schemas";

describe("sendMessageJobSchema", () => {
  it("accepts a valid payload", () => {
    const result = sendMessageJobSchema.safeParse({
      messageId: "123e4567-e89b-12d3-a456-426614174000",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid payload", () => {
    const result = sendMessageJobSchema.safeParse({ messageId: "not-a-uuid" });
    expect(result.success).toBe(false);
  });
});
