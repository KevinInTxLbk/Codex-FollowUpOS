import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../src/index";

describe("GET /health", () => {
  it("returns expected health payload", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.data).toMatchObject({
      service: "api",
      port: 3000,
      expectedPort: 3000,
      expectedWebBaseUrl: "http://localhost:3001",
    });
  });
});
