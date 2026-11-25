import request from "supertest";
import mongoose from "mongoose";
import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import { Session } from "../src/modules/auth/session.model.js";
import app from "../src/app.js";
import { User } from "../src/modules/users/user.model.js";
import { Account } from "../src/modules/account/account.model.js";

describe("FinLedger Account Integration Tests", () => {
  let accessToken: string;
  let userId: string;

  const testEmail = `account-test-${Date.now()}@example.com`;
  const testPassword = "TestPassword@12345";

  beforeAll(async () => {
    // Create a fresh test user using the registration API.
    const registerResponse = await request(app)
      .post("/api/v1/auth/register")
      .send({
        fullName: "Account Test User",
        email: testEmail,
        password: testPassword,
      });

    expect(registerResponse.status).toBe(201);

    // Login to obtain an access token.
    const loginResponse = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: testEmail,
        password: testPassword,
      });

    expect(loginResponse.status).toBe(200);

    accessToken = loginResponse.body.data.accessToken;

    expect(typeof accessToken).toBe("string");
expect(accessToken.length).toBeGreaterThan(20);

    const user = await User.findOne({ email: testEmail });

    if (!user) {
      throw new Error("Test user was not created");
    }

    userId = user._id.toString();
  });

  afterAll(async () => {
  if (!userId) return;

  const ownerId = new mongoose.Types.ObjectId(userId);

  // Delete only the accounts created by this test user.
  await Account.deleteMany({
    userId: ownerId,
  });

  // Delete the test user's login sessions.
  await Session.deleteMany({
    userId: ownerId,
  });

  // Finally, delete the test user.
  await User.deleteOne({
    _id: ownerId,
  });
});

  it("should create a savings account successfully", async () => {
    const response = await request(app)
      .post("/api/v1/accounts")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        accountType: "SAVINGS",
      });

      console.log("Account API status:", response.status);
console.log("Account API error:", response.body);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.accountType).toBe("SAVINGS");
    expect(response.body.data.balance).toBe(0);
    expect(response.body.data.status).toBe("ACTIVE");
  });

  it("should allow maximum 5 open accounts", async () => {
    // One account already created in previous test.
    for (let i = 0; i < 4; i++) {
      const response = await request(app)
        .post("/api/v1/accounts")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          accountType: "SAVINGS",
        });

      expect(response.status).toBe(201);
    }

    const sixthResponse = await request(app)
      .post("/api/v1/accounts")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        accountType: "SAVINGS",
      });

    expect(sixthResponse.status).toBe(409);

    const accountCount = await Account.countDocuments({
      userId: new mongoose.Types.ObjectId(userId),
      status: { $in: ["ACTIVE", "FROZEN"] },
    });

    expect(accountCount).toBe(5);

    const user = await User.findById(userId);

    expect(user?.activeAccountCount).toBe(5);
  });
});