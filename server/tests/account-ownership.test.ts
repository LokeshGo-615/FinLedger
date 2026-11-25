
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

describe("Account Ownership Security", () => {
  let userAId: string | undefined;
  let userBId: string | undefined;
  let userAToken: string;
  let userBToken: string;
  let accountAId: string;

  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  async function createTestUser(name: string, email: string) {
    const password = "TestPassword@12345";

    const registerResponse = await request(app)
      .post("/api/v1/auth/register")
      .send({ fullName: name, email, password });

    expect(registerResponse.status).toBe(201);

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Test user not found");
    }

    // Capture ID before any later assertion can fail.
    if (name === "Test User A") {
      userAId = user._id.toString();
    } else {
      userBId = user._id.toString();
    }

    const loginResponse = await request(app)
      .post("/api/v1/auth/login")
      .send({ email, password });

    expect(loginResponse.status).toBe(200);

    return loginResponse.body.data.accessToken as string;
  }

  beforeAll(async () => {
    userAToken = await createTestUser(
      "Test User A",
      `owner-a-${suffix}@example.com`
    );

    userBToken = await createTestUser(
      "Test User B",
      `owner-b-${suffix}@example.com`
    );

    const response = await request(app)
      .post("/api/v1/accounts")
      .set("Authorization", `Bearer ${userAToken}`)
      .send({ accountType: "SAVINGS" });

    expect(response.status).toBe(201);

    accountAId = response.body.data.id;
  });

  afterAll(async () => {
    for (const id of [userAId, userBId]) {
      if (!id) continue;

      const ownerId = new mongoose.Types.ObjectId(id);

      await Account.deleteMany({ userId: ownerId });
      await Session.deleteMany({ userId: ownerId });
      await User.deleteOne({ _id: ownerId });
    }
  });

  it("should allow User A to access their own account", async () => {
    const response = await request(app)
      .get(`/api/v1/accounts/${accountAId}`)
      .set("Authorization", `Bearer ${userAToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(accountAId);
  });

  it("should prevent User B from accessing User A's account", async () => {
    const response = await request(app)
      .get(`/api/v1/accounts/${accountAId}`)
      .set("Authorization", `Bearer ${userBToken}`);

    expect(response.status).toBe(404);
  });

  it("should not expose User A's account in User B's list", async () => {
    const response = await request(app)
      .get("/api/v1/accounts")
      .set("Authorization", `Bearer ${userBToken}`);

    expect(response.status).toBe(200);

    const accounts = response.body.data;

    expect(Array.isArray(accounts)).toBe(true);
    expect(
      accounts.some((account: { id: string }) => account.id === accountAId)
    ).toBe(false);
  });

  it("should prevent User B from closing User A's account", async () => {
    const response = await request(app)
      .patch(`/api/v1/accounts/${accountAId}/close`)
      .set("Authorization", `Bearer ${userBToken}`);

    expect(response.status).toBe(404);

    const account = await Account.findById(accountAId);
    expect(account?.status).toBe("ACTIVE");
  });
});
