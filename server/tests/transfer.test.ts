
import request from "supertest";
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

import { MAX_BALANCE } from "../src/utils/money.js";

describe("FinLedger Transfer Integration Tests", () => {

  let senderUserId = "";
  let receiverUserId = "";

  let senderToken = "";
  let receiverToken = "";

  let senderAccountId = "";
  let receiverAccountId = "";

  const password = "TestPassword@12345";

  // ==========================================
  // HELPER FUNCTIONS
  // ==========================================

  async function createTestUser() {
    const email = `transfer-${randomUUID()}@example.com`;

    const registration = await request(app)
      .post("/api/v1/auth/register")
      .send({
        fullName: "Transfer Test User",
        email,
        password,
      });

    expect(registration.status).toBe(201);

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Test user creation failed");
    }

    const login = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email,
        password,
      });

    expect(login.status).toBe(200);

    return {
      userId: user._id.toString(),
      token: login.body.data.accessToken as string,
    };
  }

  async function createTestAccount(token: string) {
    const response = await request(app)
      .post("/api/v1/accounts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        accountType: "SAVINGS",
      });

    expect(response.status).toBe(201);

    const accountId =
      response.body.data.id ??
      response.body.data._id;

    if (!accountId) {
      throw new Error("Account ID not returned");
    }

    return accountId as string;
  }

  function deposit(
    accountId: string,
    amount: string,
    token: string
  ) {
    return request(app)
      .post("/api/v1/transactions/deposit")
      .set("Authorization", `Bearer ${token}`)
      .set("Idempotency-Key", randomUUID())
      .send({
        accountId,
        amount,
      });
  }

  function transfer(
    amount: string,
    key: string = randomUUID(),
    sourceId: string = senderAccountId,
    destinationId: string = receiverAccountId,
    token: string = senderToken
  ) {
    return request(app)
      .post("/api/v1/transactions/transfer")
      .set("Authorization", `Bearer ${token}`)
      .set("Idempotency-Key", key)
      .send({
        sourceAccountId: sourceId,
        destinationAccountId: destinationId,
        amount,
      });
  }

  // ==========================================
  // DATABASE CLEANUP
  // ==========================================

  async function clearFixtures() {
    const userIds = [
      senderUserId,
      receiverUserId,
    ].filter(Boolean);

    if (userIds.length === 0) return;

    const transactions = await Transaction.find({
      userId: { $in: userIds },
    }).select("_id");

    const transactionIds = transactions.map(
      (transaction) => transaction._id
    );

    await LedgerEntry.deleteMany({
      transactionId: { $in: transactionIds },
    });

    await Transaction.deleteMany({
      userId: { $in: userIds },
    });

    await Account.deleteMany({
      userId: { $in: userIds },
    });

    await User.updateMany(
      {
        _id: { $in: userIds },
      },
      {
        $set: {
          activeAccountCount: 0,
        },
      }
    );
  }

  // ==========================================
  // TEST SETUP
  // ==========================================

  beforeAll(async () => {
    await Transaction.init();
    await LedgerEntry.init();

    const sender = await createTestUser();

    senderUserId = sender.userId;
    senderToken = sender.token;

    const receiver = await createTestUser();

    receiverUserId = receiver.userId;
    receiverToken = receiver.token;
  });

  beforeEach(async () => {
    await clearFixtures();

    senderAccountId =
      await createTestAccount(senderToken);

    receiverAccountId =
      await createTestAccount(receiverToken);

    const funding = await deposit(
      senderAccountId,
      "5000.00",
      senderToken
    );

    expect(funding.status).toBe(200);
  });

  afterAll(async () => {
    await clearFixtures();

    const userIds = [
      senderUserId,
      receiverUserId,
    ].filter(Boolean);

    if (userIds.length > 0) {
      await Session.deleteMany({
        userId: { $in: userIds },
      });

      await User.deleteMany({
        _id: { $in: userIds },
      });
    }
  });

  // ==========================================
  // TEST 1: SUCCESSFUL TRANSFER
  // ==========================================

  it("transfers virtual funds successfully", async () => {
    const response = await transfer("1000.00");

    expect(response.status).toBe(200);
    expect(response.body.data.type).toBe("TRANSFER");
    expect(response.body.data.amount).toBe(100000);
    expect(response.body.data.status).toBe("COMPLETED");

    const sender = await Account.findById(senderAccountId);
    const receiver = await Account.findById(receiverAccountId);

    expect(sender?.balance).toBe(400000);
    expect(receiver?.balance).toBe(100000);
  });

  // ==========================================
  // TEST 2: INSUFFICIENT BALANCE
  // ==========================================

  it("rejects transfer with insufficient balance", async () => {
    const response = await transfer("6000.00");

    expect(response.status).toBe(409);

    const sender = await Account.findById(senderAccountId);
    const receiver = await Account.findById(receiverAccountId);

    expect(sender?.balance).toBe(500000);
    expect(receiver?.balance).toBe(0);

    const count = await Transaction.countDocuments({
      userId: senderUserId,
      type: "TRANSFER",
    });

    expect(count).toBe(0);
  });

  // ==========================================
  // TEST 3: DOUBLE-ENTRY LEDGER
  // ==========================================

  it("creates two balanced transfer ledger entries", async () => {
    const response = await transfer("1000.00");

    expect(response.status).toBe(200);

    const transactionId = response.body.data.id;

    const entries = await LedgerEntry.find({
      transactionId,
    });

    expect(entries).toHaveLength(2);

    const debit = entries.find(
      (entry) => entry.direction === "DEBIT"
    );

    const credit = entries.find(
      (entry) => entry.direction === "CREDIT"
    );

    expect(debit?.amount).toBe(100000);
    expect(credit?.amount).toBe(100000);

    expect(debit?.accountId.toString())
      .toBe(senderAccountId);

    expect(credit?.accountId.toString())
      .toBe(receiverAccountId);

    expect(debit?.accountKind).toBe("CUSTOMER");
    expect(credit?.accountKind).toBe("CUSTOMER");

    expect(debit?.currency).toBe("INR");
    expect(credit?.currency).toBe("INR");
  });

  // ==========================================
  // TEST 4: DUPLICATE TRANSFER PREVENTION
  // ==========================================

  it("prevents duplicate transfers", async () => {
    const key = randomUUID();

    const first = await transfer("1000.00", key);
    const second = await transfer("1000.00", key);

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);

    expect(first.body.data.id)
      .toBe(second.body.data.id);

    const sender = await Account.findById(senderAccountId);
    const receiver = await Account.findById(receiverAccountId);

    expect(sender?.balance).toBe(400000);
    expect(receiver?.balance).toBe(100000);

    const count = await Transaction.countDocuments({
      userId: senderUserId,
      type: "TRANSFER",
    });

    expect(count).toBe(1);

    const ledgerCount = await LedgerEntry.countDocuments({
      transactionId: first.body.data.id,
    });

    expect(ledgerCount).toBe(2);
  });

  // ==========================================
  // TEST 5: SAME KEY, DIFFERENT AMOUNT
  // ==========================================

  it("rejects reused key with different amount", async () => {
    const key = randomUUID();

    const first = await transfer("1000.00", key);
    const second = await transfer("2000.00", key);

    expect(first.status).toBe(200);
    expect(second.status).toBe(409);

    const sender = await Account.findById(senderAccountId);
    const receiver = await Account.findById(receiverAccountId);

    expect(sender?.balance).toBe(400000);
    expect(receiver?.balance).toBe(100000);
  });

  // ==========================================
  // TEST 6: SAME KEY, DIFFERENT RECEIVER
  // ==========================================

  it("rejects reused key with different receiver", async () => {
    const thirdAccountId =
      await createTestAccount(receiverToken);

    const key = randomUUID();

    const first = await transfer("1000.00", key);

    const second = await transfer(
      "1000.00",
      key,
      senderAccountId,
      thirdAccountId
    );

    expect(first.status).toBe(200);
    expect(second.status).toBe(409);

    const thirdAccount = await Account.findById(thirdAccountId);
    const sender = await Account.findById(senderAccountId);
    const receiver = await Account.findById(receiverAccountId);

    expect(thirdAccount?.balance).toBe(0);
    expect(sender?.balance).toBe(400000);
    expect(receiver?.balance).toBe(100000);
  });

  // ==========================================
  // TEST 7: SELF TRANSFER
  // ==========================================

  it("rejects self-transfer", async () => {
    const response = await transfer(
      "1000.00",
      randomUUID(),
      senderAccountId,
      senderAccountId
    );

    expect(response.status).toBe(400);

    const sender = await Account.findById(senderAccountId);

    expect(sender?.balance).toBe(500000);
  });

  // ==========================================
  // TEST 8: ZERO AMOUNT
  // ==========================================

  it("rejects zero transfer amount", async () => {
    const response = await transfer("0.00");

    expect(response.status).toBe(400);
  });

  // ==========================================
  // TEST 9: NEGATIVE AMOUNT
  // ==========================================

  it("rejects negative transfer amount", async () => {
    const response = await transfer("-1000.00");

    expect(response.status).toBe(400);
  });

  // ==========================================
  // TEST 10: MISSING AUTHENTICATION
  // ==========================================

  it("rejects transfer without authentication", async () => {
    const response = await request(app)
      .post("/api/v1/transactions/transfer")
      .set("Idempotency-Key", randomUUID())
      .send({
        sourceAccountId: senderAccountId,
        destinationAccountId: receiverAccountId,
        amount: "1000.00",
      });

    expect(response.status).toBe(401);
  });

  // ==========================================
  // TEST 11: UNAUTHORIZED SENDER
  // ==========================================

  it("rejects transfer from another user's account", async () => {
    const response = await transfer(
      "1000.00",
      randomUUID(),
      senderAccountId,
      receiverAccountId,
      receiverToken
    );

    expect(response.status).toBe(409);

    const sender = await Account.findById(senderAccountId);
    const receiver = await Account.findById(receiverAccountId);

    expect(sender?.balance).toBe(500000);
    expect(receiver?.balance).toBe(0);
  });

  // ==========================================
  // TEST 12: FROZEN SENDER
  // ==========================================

  it("rejects transfer from frozen sender account", async () => {
    await Account.findByIdAndUpdate(
      senderAccountId,
      {
        status: "FROZEN",
      }
    );

    const response = await transfer("1000.00");

    expect(response.status).toBe(409);

    const sender = await Account.findById(senderAccountId);
    const receiver = await Account.findById(receiverAccountId);

    expect(sender?.balance).toBe(500000);
    expect(receiver?.balance).toBe(0);
  });

  // ==========================================
  // TEST 13: FROZEN RECEIVER AND ROLLBACK
  // ==========================================

  it("rolls back transfer when receiver is frozen", async () => {
    await Account.findByIdAndUpdate(
      receiverAccountId,
      {
        status: "FROZEN",
      }
    );

    const response = await transfer("1000.00");

    expect(response.status).toBe(409);

    const sender = await Account.findById(senderAccountId);
    const receiver = await Account.findById(receiverAccountId);

    expect(sender?.balance).toBe(500000);
    expect(receiver?.balance).toBe(0);

    const count = await Transaction.countDocuments({
      userId: senderUserId,
      type: "TRANSFER",
    });

    expect(count).toBe(0);

    const receiverLedgerCount =
      await LedgerEntry.countDocuments({
        accountId: receiverAccountId,
      });

    expect(receiverLedgerCount).toBe(0);
  });

  // ==========================================
  // TEST 14: RECEIVER BALANCE LIMIT
  // ==========================================

  it("rolls back when receiver balance limit is exceeded", async () => {
    await Account.findByIdAndUpdate(
      receiverAccountId,
      {
        balance: MAX_BALANCE,
      }
    );

    const response = await transfer("1000.00");

    expect(response.status).toBe(409);

    const sender = await Account.findById(senderAccountId);
    const receiver = await Account.findById(receiverAccountId);

    expect(sender?.balance).toBe(500000);
    expect(receiver?.balance).toBe(MAX_BALANCE);

    const count = await Transaction.countDocuments({
      userId: senderUserId,
      type: "TRANSFER",
    });

    expect(count).toBe(0);

    const receiverLedgerCount =
      await LedgerEntry.countDocuments({
        accountId: receiverAccountId,
      });

    expect(receiverLedgerCount).toBe(0);
  });

  // ==========================================
  // TEST 15: CONCURRENT TRANSFER PROTECTION
  // ==========================================

  it("prevents overdraft during concurrent transfers", async () => {
    const [first, second] = await Promise.all([
      transfer("4000.00"),
      transfer("4000.00"),
    ]);

    const statuses = [
      first.status,
      second.status,
    ].sort((a, b) => a - b);

    expect(statuses).toEqual([200, 409]);

    const sender = await Account.findById(senderAccountId);
    const receiver = await Account.findById(receiverAccountId);

    expect(sender?.balance).toBe(100000);
    expect(receiver?.balance).toBe(400000);

    const count = await Transaction.countDocuments({
      userId: senderUserId,
      type: "TRANSFER",
    });

    expect(count).toBe(1);

    const successfulResponse =
      first.status === 200 ? first : second;

    const ledgerCount = await LedgerEntry.countDocuments({
      transactionId: successfulResponse.body.data.id,
    });

    expect(ledgerCount).toBe(2);
  });
});
