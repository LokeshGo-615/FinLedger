
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

import { Transaction } from "../src/modules/transactions/transaction.model.js";
import { LedgerEntry } from "../src/modules/ledger/ledger.model.js";

describe("FinLedger Deposit Integration Tests", () => {
  let userId: string | undefined;
  let token: string;
  let accountId: string;

  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const email = `deposit-${suffix}@example.com`;
  const password = "TestPassword@12345";

  beforeAll(async () => {
    const registration = await request(app)
      .post("/api/v1/auth/register")
      .send({
        fullName: "Deposit Test User",
        email,
        password,
      });

    expect(registration.status).toBe(201);

    const user = await User.findOne({ email });
    if (!user) throw new Error("Test user missing");

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

    const ownerId = new mongoose.Types.ObjectId(userId);

    const transactions = await Transaction.find({
      userId: ownerId,
    }).select("_id");

    const transactionIds = transactions.map((t) => t._id);

    await LedgerEntry.deleteMany({
      transactionId: { $in: transactionIds },
    });

    await Transaction.deleteMany({ userId: ownerId });
    await Account.deleteMany({ userId: ownerId });
    await Session.deleteMany({ userId: ownerId });
    await User.deleteOne({ _id: ownerId });
  });

  const deposit = (
    amount: string,
    key: string
  ) =>
    request(app)
      .post("/api/v1/transactions/deposit")
      .set("Authorization", `Bearer ${token}`)
      .set("Idempotency-Key", key)
      .send({ accountId, amount });

  it("deposits virtual funds successfully", async () => {
    const response = await deposit(
      "500.00",
      "deposit-test-001"
    );

    // Debugging logs
  console.log("Deposit status:", response.status);
  console.log("Deposit response:", response.body);


    expect(response.status).toBe(200);
    expect(response.body.data.amount).toBe(50000);

    const account = await Account.findById(accountId);
    expect(account?.balance).toBe(50000);
  });

  it("creates two balanced ledger entries", async () => {
    const transaction = await Transaction.findOne({
      userId,
      idempotencyKey: "deposit-test-001",
    });

    expect(transaction).not.toBeNull();

    const entries = await LedgerEntry.find({
      transactionId: transaction!._id,
    });

    expect(entries).toHaveLength(2);

    const debit = entries
      .filter((e) => e.direction === "DEBIT")
      .reduce((sum, e) => sum + e.amount, 0);

    const credit = entries
      .filter((e) => e.direction === "CREDIT")
      .reduce((sum, e) => sum + e.amount, 0);

    expect(debit).toBe(credit);
    expect(debit).toBe(50000);
  });

  it("does not deposit twice for the same idempotency key", async () => {
    const response = await deposit(
      "500.00",
      "deposit-test-001"
    );

    expect(response.status).toBe(200);

    const account = await Account.findById(accountId);
    expect(account?.balance).toBe(50000);

    const count = await Transaction.countDocuments({
      userId,
      idempotencyKey: "deposit-test-001",
    });

    expect(count).toBe(1);
  });

  it("rejects reusing a key with a different amount", async () => {
    const response = await deposit(
      "600.00",
      "deposit-test-001"
    );

    expect(response.status).toBe(409);
  });

  it("rejects zero deposits", async () => {
    const response = await deposit(
      "0",
      "deposit-test-zero"
    );

    expect(response.status).toBe(400);
  });

  it("rejects missing authentication", async () => {
    const response = await request(app)
      .post("/api/v1/transactions/deposit")
      .set("Idempotency-Key", "deposit-no-auth")
      .send({
        accountId,
        amount: "100.00",
      });

    expect(response.status).toBe(401);
  });
});
