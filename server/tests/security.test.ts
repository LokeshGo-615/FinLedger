
import request from "supertest";
import mongoose from "mongoose";

import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
} from "@jest/globals";

import app from "../src/app.js";
import { User } from "../src/modules/users/user.model.js";
import { Account } from "../src/modules/account/account.model.js";
import { Session } from "../src/modules/auth/session.model.js";
import { UserRole } from "../src/modules/users/user.types.js";

describe("FinLedger Security Regression Tests", () => {
  let userId: string | undefined;
  let token: string;
  let accountId: string;

  const suffix =
    `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  const email = `security-${suffix}@example.com`;
  const password = "TestPassword@12345";

  beforeAll(async () => {
    const register = await request(app)
      .post("/api/v1/auth/register")
      .send({
        fullName: "Security Test User",
        email,
        password
      });

    expect(register.status).toBe(201);

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Security test user missing");
    }

    userId = user._id.toString();

    const login = await request(app)
      .post("/api/v1/auth/login")
      .send({ email, password });

    expect(login.status).toBe(200);

    token = login.body.data.accessToken;

    const created = await request(app)
      .post("/api/v1/accounts")
      .set("Authorization", `Bearer ${token}`)
      .send({ accountType: "SAVINGS" });

    expect(created.status).toBe(201);

    accountId = created.body.data.id;
  });

  afterAll(async () => {
    if (!userId) return;

    const id = new mongoose.Types.ObjectId(userId);

    await Account.deleteMany({ userId: id });
    await Session.deleteMany({ userId: id });
    await User.deleteOne({ _id: id });
  });

  it("rejects missing authentication", async () => {
    const response = await request(app)
      .get("/api/v1/accounts");

    expect(response.status).toBe(401);
  });

  it("rejects malformed access tokens", async () => {
    const response = await request(app)
      .get("/api/v1/accounts")
      .set("Authorization", "Bearer invalid-token");

    expect(response.status).toBe(401);
  });

  it("rejects unsupported auth schemes", async () => {
    const response = await request(app)
      .get("/api/v1/accounts")
      .set("Authorization", "Basic invalid");

    expect(response.status).toBe(401);
  });

  it("rejects invalid account IDs", async () => {
    const response = await request(app)
      .get("/api/v1/accounts/not-an-object-id")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
  });

  it("rejects unexpected account creation fields", async () => {
    const response = await request(app)
      .post("/api/v1/accounts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        accountType: "SAVINGS",
        balance: 999999999
      });

    expect(response.status).toBe(400);
  });

  it("prevents USER from freezing accounts", async () => {
    const response = await request(app)
      .patch(`/api/v1/accounts/${accountId}/freeze`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);

    const account = await Account.findById(accountId);

    expect(account?.status).toBe("ACTIVE");
  });

  it("prevents USER from unfreezing accounts", async () => {
    const response = await request(app)
      .patch(`/api/v1/accounts/${accountId}/unfreeze`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
  });

  it("does not grant ADMIN role during registration", async () => {
    const user = await User.findById(userId);

    expect(user?.role).toBe(UserRole.USER);
  });

  it("returns Helmet security headers", async () => {
    const response = await request(app)
      .get("/api/v1/health");

    expect(response.status).toBe(200);
    expect(
      response.headers["x-content-type-options"]
    ).toBe("nosniff");
  });

  it("allows configured frontend origin", async () => {
    const origin = process.env.CLIENT_URL;

    if (!origin) {
      throw new Error("CLIENT_URL missing");
    }

    const response = await request(app)
      .get("/api/v1/health")
      .set("Origin", origin);

    expect(response.status).toBe(200);

    expect(
      response.headers["access-control-allow-origin"]
    ).toBe(origin);
  });

  it("rejects unknown routes", async () => {
    const response = await request(app)
      .get("/api/v1/unknown-endpoint");

    expect(response.status).toBe(404);
  });

  it("does not expose stack traces in 404 responses", async () => {
    const response = await request(app)
      .get("/api/v1/unknown-endpoint");

    const body = JSON.stringify(response.body);

    expect(body).not.toContain("node_modules");
    expect(body).not.toContain("at Layer.");
  });
});
