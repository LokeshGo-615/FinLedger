
import request from "supertest";
import mongoose from "mongoose";
import { randomUUID } from "node:crypto";

import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
} from "@jest/globals";

import app from "../src/app.js";

import { User } from "../src/modules/users/user.model.js";
import { Account } from "../src/modules/account/account.model.js";
import { Session } from "../src/modules/auth/session.model.js";

import { Transaction } from "../src/modules/transactions/transaction.model.js";
import { LedgerEntry } from "../src/modules/ledger/ledger.model.js";

describe("FinLedger Withdrawal Integration Tests", () => {

  let userId: string | undefined;
  let token: string;
  let accountId: string;

  const email =
    `withdrawal-${randomUUID()}@example.com`;

  const password = "TestPassword@12345";

  beforeAll(async () => {

    const registration = await request(app)
      .post("/api/v1/auth/register")
      .send({
        fullName: "Withdrawal Test User",
        email,
        password,
      });

    expect(registration.status).toBe(201);

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Test user missing");
    }

    userId = user._id.toString();

    const login = await request(app)
      .post("/api/v1/auth/login")
      .send({ email, password });

    expect(login.status).toBe(200);

    token = login.body.data.accessToken;

    await Transaction.init();
    await LedgerEntry.init();
  });

  // Test database cleanup for isolated fixtures.
  async function clearFixtures() {
    if (!userId) return;

    const ownerId = new mongoose.Types.ObjectId(userId);

    const transactions = await Transaction.find({
      userId: ownerId,
    }).select("_id");

    await LedgerEntry.deleteMany({
      transactionId: {
        $in: transactions.map((t) => t._id),
      },
    });

    await Transaction.deleteMany({
      userId: ownerId,
    });

    await Account.deleteMany({
      userId: ownerId,
    });

    await User.updateOne(
      { _id: ownerId },
      { $set: { activeAccountCount: 0 } }
    );
  }

  beforeEach(async () => {

    await clearFixtures();

    const created = await request(app)
      .post("/api/v1/accounts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        accountType: "SAVINGS",
      });

    expect(created.status).toBe(201);

    accountId = created.body.data.id;

    // Fund each test account with virtual Rs. 1000.
    const deposit = await request(app)
      .post("/api/v1/transactions/deposit")
      .set("Authorization", `Bearer ${token}`)
      .set("Idempotency-Key", randomUUID())
      .send({
        accountId,
        amount: "1000.00",
      });

    expect(deposit.status).toBe(200);
  });

  afterAll(async () => {

    if (!userId) return;

    await clearFixtures();

    const ownerId = new mongoose.Types.ObjectId(userId);

    await Session.deleteMany({
      userId: ownerId,
    });

    await User.deleteOne({
      _id: ownerId,
    });
  });

  const withdraw = (
    amount: string,
    key: string = randomUUID()
  ) =>
    request(app)
      .post("/api/v1/transactions/withdraw")
      .set("Authorization", `Bearer ${token}`)
      .set("Idempotency-Key", key)
      .send({
        accountId,
        amount,
      });

  // TEST 1
  it("withdraws virtual funds successfully", async () => {

    const response = await withdraw("300.00");

    expect(response.status).toBe(200);
    expect(response.body.data.type).toBe("WITHDRAWAL");
    expect(response.body.data.amount).toBe(30000);

    const account = await Account.findById(accountId);

    expect(account?.balance).toBe(70000);
  });

  // TEST 2
  it("rejects withdrawal with insufficient balance", async () => {

    const response = await withdraw("1200.00");

    expect(response.status).toBe(409);

    const account = await Account.findById(accountId);

    expect(account?.balance).toBe(100000);

    expect(
      await Transaction.countDocuments({
        userId,
        type: "WITHDRAWAL",
      })
    ).toBe(0);
  });

  // TEST 3
  it("creates two balanced withdrawal ledger entries", async () => {

    const response = await withdraw("200.00");

    expect(response.status).toBe(200);

    const entries = await LedgerEntry.find({
      transactionId: response.body.data.id,
    });

    expect(entries).toHaveLength(2);

    const debit = entries.find(
      (entry) => entry.direction === "DEBIT"
    );

    const credit = entries.find(
      (entry) => entry.direction === "CREDIT"
    );

    expect(debit?.amount).toBe(20000);
    expect(credit?.amount).toBe(20000);

    expect(debit?.accountKind).toBe("CUSTOMER");
    expect(debit?.accountId.toString()).toBe(accountId);
    expect(credit?.accountKind).toBe("SYSTEM");
  });

  // TEST 4
  it("prevents duplicate withdrawals", async () => {

    const key = randomUUID();

    const first = await withdraw("300.00", key);
    const second = await withdraw("300.00", key);

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);

    expect(first.body.data.id)
      .toBe(second.body.data.id);

    const account = await Account.findById(accountId);

    expect(account?.balance).toBe(70000);

    const count = await Transaction.countDocuments({
      userId,
      idempotencyKey: key,
    });

    expect(count).toBe(1);
  });

  // TEST 5
  it("rejects reused key with a different amount", async () => {

    const key = randomUUID();

    const first = await withdraw("100.00", key);
    const second = await withdraw("200.00", key);

    expect(first.status).toBe(200);
    expect(second.status).toBe(409);

    const account = await Account.findById(accountId);

    expect(account?.balance).toBe(90000);
  });

  // TEST 6
  it("rejects zero withdrawal", async () => {

    const response = await withdraw("0");

    expect(response.status).toBe(400);
  });

  // TEST 7
  it("rejects negative withdrawal", async () => {

    const response = await withdraw("-100");

    expect(response.status).toBe(400);
  });

  // TEST 8
  it("rejects missing authentication", async () => {

    const response = await request(app)
      .post("/api/v1/transactions/withdraw")
      .set("Idempotency-Key", randomUUID())
      .send({
        accountId,
        amount: "100.00",
      });

    expect(response.status).toBe(401);
  });

  // TEST 9
  it("rejects withdrawal from a frozen account", async () => {

    // Direct database update only for test fixture setup.
    await Account.updateOne(
      { _id: accountId },
      { $set: { status: "FROZEN" } }
    );

    const response = await withdraw("100.00");

    expect(response.status).toBe(409);

    const account = await Account.findById(accountId);

    expect(account?.balance).toBe(100000);
  });

  // TEST 10
  it("prevents overdraft during concurrent withdrawals", async () => {

    const responses = await Promise.all([
      withdraw("700.00"),
      withdraw("700.00"),
    ]);

    const successful = responses.filter(
      (response) => response.status === 200
    );

    const rejected = responses.filter(
      (response) => response.status === 409
    );

    expect(successful).toHaveLength(1);
    expect(rejected).toHaveLength(1);

    const account = await Account.findById(accountId);

    expect(account?.balance).toBe(30000);

    const count = await Transaction.countDocuments({
      userId,
      type: "WITHDRAWAL",
    });

    expect(count).toBe(1);
  });
});
