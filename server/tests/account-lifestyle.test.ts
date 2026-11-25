
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

describe("FinLedger Account Lifecycle & Concurrency", () => {
  let userId: string | undefined;
  let accessToken: string;

  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const email = `lifecycle-${suffix}@example.com`;
  const password = "TestPassword@12345";

  const auth = () => ({
    Authorization: `Bearer ${accessToken}`,
  });

  async function createAccount() {
    return request(app)
      .post("/api/v1/accounts")
      .set(auth())
      .send({ accountType: "SAVINGS" });
  }

  beforeAll(async () => {
    const registration = await request(app)
      .post("/api/v1/auth/register")
      .send({
        fullName: "Lifecycle Test User",
        email,
        password,
      });

    expect(registration.status).toBe(201);

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Test user not found");
    }

    userId = user._id.toString();

    const login = await request(app)
      .post("/api/v1/auth/login")
      .send({ email, password });

    expect(login.status).toBe(200);

    accessToken = login.body.data.accessToken;
  });

  afterAll(async () => {
    if (!userId) return;

    const ownerId = new mongoose.Types.ObjectId(userId);

    await Account.deleteMany({ userId: ownerId });
    await Session.deleteMany({ userId: ownerId });
    await User.deleteOne({ _id: ownerId });
  });

  // TEST 1
  it("should reject invalid account types", async () => {
    const response = await request(app)
      .post("/api/v1/accounts")
      .set(auth())
      .send({ accountType: "INVALID" });

    expect(response.status).toBe(400);
  });

  // TEST 2
  it("should reject unexpected account creation fields", async () => {
    const response = await request(app)
      .post("/api/v1/accounts")
      .set(auth())
      .send({
        accountType: "SAVINGS",
        balance: 1000000,
      });

    expect(response.status).toBe(400);
  });

  // TEST 3
  it("should create no more than 5 accounts under concurrent requests", async () => {
    const responses = await Promise.all(
      Array.from({ length: 10 }, () => createAccount())
    );

    const success = responses.filter((r) => r.status === 201);
    const rejected = responses.filter((r) => r.status === 409);

    expect(success).toHaveLength(5);
    expect(rejected).toHaveLength(5);

    const accounts = await Account.find({
      userId: userId,
      status: { $in: ["ACTIVE", "FROZEN"] },
    });

    expect(accounts).toHaveLength(5);

    const user = await User.findById(userId);
    expect(user?.activeAccountCount).toBe(5);
  });

  // TEST 4
  it("should reject creation after the account limit is reached", async () => {
    const response = await createAccount();

    expect(response.status).toBe(409);
  });

  // TEST 5
  it("should close an empty active account", async () => {
    const account = await Account.findOne({
      userId,
      status: "ACTIVE",
      balance: 0,
    });

    expect(account).not.toBeNull();

    const response = await request(app)
      .patch(`/api/v1/accounts/${account!._id}/close`)
      .set(auth());

    expect(response.status).toBe(200);
    expect(response.body.data.status).toBe("CLOSED");

    const updated = await Account.findById(account!._id);
    expect(updated?.status).toBe("CLOSED");
    expect(updated?.closedAt).not.toBeNull();

    const user = await User.findById(userId);
    expect(user?.activeAccountCount).toBe(4);
  });

  // TEST 6
  it("should allow account slot reuse after closure", async () => {
    const response = await createAccount();

    expect(response.status).toBe(201);

    const user = await User.findById(userId);
    expect(user?.activeAccountCount).toBe(5);
  });

  // TEST 7
  it("should prevent closing an already closed account", async () => {
    const closedAccount = await Account.findOne({
      userId,
      status: "CLOSED",
    });

    expect(closedAccount).not.toBeNull();

    const response = await request(app)
      .patch(`/api/v1/accounts/${closedAccount!._id}/close`)
      .set(auth());

    expect(response.status).toBe(409);
  });

  // TEST 8
  it("should preserve the counter after a rejected operation", async () => {
    const before = await User.findById(userId);

    const response = await createAccount();

    expect(response.status).toBe(409);

    const after = await User.findById(userId);

    expect(after?.activeAccountCount).toBe(
      before?.activeAccountCount
    );

    const openAccounts = await Account.countDocuments({
      userId,
      status: { $in: ["ACTIVE", "FROZEN"] },
    });

    expect(openAccounts).toBe(5);
  });
});
