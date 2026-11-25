import request from "supertest";
import { describe, it, expect } from "@jest/globals";

import app from "../src/app.js";

describe("FinLedger Health API", () => {
  it("should return 200 OK", async () => {
    const response = await request(app)
      .get("/api/v1/health");

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.message).toBe(
      "FinLedger API is running"
    );
  });

  it("should return 404 for unknown routes", async () => {
    const response = await request(app)
      .get("/api/v1/unknown-route");

    expect(response.status).toBe(404);
  });

  it("should reject unauthenticated account requests", async () => {
    const response = await request(app)
      .get("/api/v1/accounts");

    expect(response.status).toBe(401);
  });
});