
import request from "supertest";
import { randomUUID } from "node:crypto";
import { Types } from "mongoose";

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

describe("FinLedger Transaction History Integration Tests", () => {
  const password = "TestPassword@12345";

  const testUserIds: string[] = [];

  let senderToken = "";
  let receiverToken = "";
  let outsiderToken = "";

  let senderAccountId = "";
  let receiverAccountId = "";
  let outsiderAccountId = "";

  let depositId = "";
  let withdrawalId = "";
  let transferId = "";

  const BASE_URL = "/api/v1/transactions";

  // ==========================================
  // HELPER FUNCTIONS
  // ==========================================

  async function createTestUser() {
    const email = `history-${randomUUID()}@example.com`;

    const registration = await request(app)
      .post("/api/v1/auth/register")
      .send({
        fullName: "History Test User",
        email,
        password,
      });

    expect(registration.status).toBe(201);

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Test user creation failed");
    }

    testUserIds.push(user._id.toString());

    const login = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email,
        password,
      });

    expect(login.status).toBe(200);

    const token = login.body.data.accessToken;

    if (!token) {
      throw new Error("Access token not returned");
    }

    return token as string;
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
      .post(`${BASE_URL}/deposit`)
      .set("Authorization", `Bearer ${token}`)
      .set("Idempotency-Key", randomUUID())
      .send({
        accountId,
        amount,
      });
  }

  function withdraw(
    accountId: string,
    amount: string,
    token: string
  ) {
    return request(app)
      .post(`${BASE_URL}/withdraw`)
      .set("Authorization", `Bearer ${token}`)
      .set("Idempotency-Key", randomUUID())
      .send({
        accountId,
        amount,
      });
  }

  function transfer(
    sourceAccountId: string,
    destinationAccountId: string,
    amount: string,
    token: string
  ) {
    return request(app)
      .post(`${BASE_URL}/transfer`)
      .set("Authorization", `Bearer ${token}`)
      .set("Idempotency-Key", randomUUID())
      .send({
        sourceAccountId,
        destinationAccountId,
        amount,
      });
  }

  function history(
    token: string = senderToken,
    query: Record<string, string | number> = {}
  ) {
    return request(app)
      .get(BASE_URL)
      .set("Authorization", `Bearer ${token}`)
      .query(query);
  }

  function details(
    transactionId: string,
    token: string = senderToken
  ) {
    return request(app)
      .get(`${BASE_URL}/${transactionId}`)
      .set("Authorization", `Bearer ${token}`);
  }

  // ==========================================
  // TEST SETUP
  // ==========================================

  beforeAll(async () => {
    await Transaction.init();
    await LedgerEntry.init();

    senderToken = await createTestUser();
    receiverToken = await createTestUser();
    outsiderToken = await createTestUser();

    senderAccountId =
      await createTestAccount(senderToken);

    receiverAccountId =
      await createTestAccount(receiverToken);

    outsiderAccountId =
      await createTestAccount(outsiderToken);

    // Sender deposits Rs. 5000

    const depositResponse = await deposit(
      senderAccountId,
      "5000.00",
      senderToken
    );

    expect(depositResponse.status).toBe(200);

    depositId = depositResponse.body.data.id;

    // Sender withdraws Rs. 500

    const withdrawalResponse = await withdraw(
      senderAccountId,
      "500.00",
      senderToken
    );

    expect(withdrawalResponse.status).toBe(200);

    withdrawalId = withdrawalResponse.body.data.id;

    // Sender transfers Rs. 1000 to receiver

    const transferResponse = await transfer(
      senderAccountId,
      receiverAccountId,
      "1000.00",
      senderToken
    );

    expect(transferResponse.status).toBe(200);

    transferId = transferResponse.body.data.id;

    // Unrelated user's transaction

    const outsiderDeposit = await deposit(
      outsiderAccountId,
      "2000.00",
      outsiderToken
    );

    expect(outsiderDeposit.status).toBe(200);
  }, 60000);

  // ==========================================
  // TEST CLEANUP
  // ==========================================

  afterAll(async () => {
    if (testUserIds.length === 0) return;

    const transactions = await Transaction.find({
      userId: { $in: testUserIds },
    }).select("_id");

    const transactionIds = transactions.map(
      (transaction) => transaction._id
    );

    await LedgerEntry.deleteMany({
      transactionId: { $in: transactionIds },
    });

    await Transaction.deleteMany({
      userId: { $in: testUserIds },
    });

    await Account.deleteMany({
      userId: { $in: testUserIds },
    });

    await Session.deleteMany({
      userId: { $in: testUserIds },
    });

    await User.deleteMany({
      _id: { $in: testUserIds },
    });
  }, 30000);

  // ==========================================
  // TEST 1: SENDER TRANSACTION HISTORY
  // ==========================================

  it("returns sender transaction history", async () => {
    const response = await history();

    expect(response.status).toBe(200);

    const transactions =
      response.body.data.transactions;

    expect(transactions).toHaveLength(3);

    const ids = transactions.map(
      (transaction: { _id: string }) =>
        transaction._id
    );

    expect(ids).toEqual(
      expect.arrayContaining([
        depositId,
        withdrawalId,
        transferId,
      ])
    );
  });

  // ==========================================
  // TEST 2: RECEIVER TRANSACTION HISTORY
  // ==========================================

  it("includes received transfers in receiver history", async () => {
    const response = await history(receiverToken);

    expect(response.status).toBe(200);

    const transactions =
      response.body.data.transactions;

    expect(transactions).toHaveLength(1);

    expect(transactions[0]._id).toBe(transferId);
    expect(transactions[0].type).toBe("TRANSFER");
    expect(transactions[0].amount).toBe(100000);
  });

  // ==========================================
  // TEST 3: INCOMING TRANSACTIONS
  // ==========================================

  it("filters incoming transactions", async () => {
    const response = await history(senderToken, {
      direction: "INCOMING",
    });

    expect(response.status).toBe(200);

    const transactions =
      response.body.data.transactions;

    expect(transactions).toHaveLength(1);
    expect(transactions[0]._id).toBe(depositId);
  });

  // ==========================================
  // TEST 4: OUTGOING TRANSACTIONS
  // ==========================================

  it("filters outgoing transactions", async () => {
    const response = await history(senderToken, {
      direction: "OUTGOING",
    });

    expect(response.status).toBe(200);

    const transactions =
      response.body.data.transactions;

    expect(transactions).toHaveLength(2);

    const ids = transactions.map(
      (transaction: { _id: string }) =>
        transaction._id
    );

    expect(ids).toEqual(
      expect.arrayContaining([
        withdrawalId,
        transferId,
      ])
    );
  });

  // ==========================================
  // TEST 5: DEPOSIT FILTER
  // ==========================================

  it("filters deposit transactions", async () => {
    const response = await history(senderToken, {
      type: "DEPOSIT",
    });

    expect(response.status).toBe(200);

    const transactions =
      response.body.data.transactions;

    expect(transactions).toHaveLength(1);
    expect(transactions[0]._id).toBe(depositId);
    expect(transactions[0].type).toBe("DEPOSIT");
  });

  // ==========================================
  // TEST 6: WITHDRAWAL FILTER
  // ==========================================

  it("filters withdrawal transactions", async () => {
    const response = await history(senderToken, {
      type: "WITHDRAWAL",
    });

    expect(response.status).toBe(200);

    const transactions =
      response.body.data.transactions;

    expect(transactions).toHaveLength(1);
    expect(transactions[0]._id).toBe(withdrawalId);
  });

  // ==========================================
  // TEST 7: TRANSFER FILTER
  // ==========================================

  it("filters transfer transactions", async () => {
    const response = await history(senderToken, {
      type: "TRANSFER",
    });

    expect(response.status).toBe(200);

    const transactions =
      response.body.data.transactions;

    expect(transactions).toHaveLength(1);
    expect(transactions[0]._id).toBe(transferId);
  });

  // ==========================================
  // TEST 8: OWN ACCOUNT FILTER
  // ==========================================

  it("filters history by owned account", async () => {
    const response = await history(senderToken, {
      accountId: senderAccountId,
    });

    expect(response.status).toBe(200);

    expect(
      response.body.data.transactions
    ).toHaveLength(3);
  });

  // ==========================================
  // TEST 9: UNAUTHORIZED ACCOUNT FILTER
  // ==========================================

  it("rejects another user's account filter", async () => {
    const response = await history(senderToken, {
      accountId: outsiderAccountId,
    });

    expect(response.status).toBe(404);
  });

  // ==========================================
  // TEST 10: ASCENDING SORT
  // ==========================================

  it("sorts transactions in ascending order", async () => {
    const response = await history(senderToken, {
      sort: "asc",
    });

    expect(response.status).toBe(200);

    const ids = response.body.data.transactions.map(
      (transaction: { _id: string }) =>
        transaction._id
    );

    expect(ids).toEqual([
      depositId,
      withdrawalId,
      transferId,
    ]);
  });

  // ==========================================
  // TEST 11: DESCENDING SORT
  // ==========================================

  it("sorts transactions in descending order", async () => {
    const response = await history(senderToken, {
      sort: "desc",
    });

    expect(response.status).toBe(200);

    const ids = response.body.data.transactions.map(
      (transaction: { _id: string }) =>
        transaction._id
    );

    expect(ids).toEqual([
      transferId,
      withdrawalId,
      depositId,
    ]);
  });

  // ==========================================
  // TEST 12: CURSOR PAGINATION
  // ==========================================

  it("returns pagination metadata", async () => {
    const response = await history(senderToken, {
      limit: 2,
    });

    expect(response.status).toBe(200);

    const { transactions, pagination } =
      response.body.data;

    expect(transactions).toHaveLength(2);
    expect(pagination.limit).toBe(2);
    expect(pagination.hasMore).toBe(true);
    expect(typeof pagination.nextCursor).toBe("string");
  });

  // ==========================================
  // TEST 13: NEXT PAGE WITHOUT DUPLICATES
  // ==========================================

  it("retrieves next page without duplicate transactions", async () => {
    const first = await history(senderToken, {
      limit: 2,
      sort: "desc",
    });

    expect(first.status).toBe(200);

    const firstIds = first.body.data.transactions.map(
      (transaction: { _id: string }) =>
        transaction._id
    );

    const cursor =
      first.body.data.pagination.nextCursor;

    expect(typeof cursor).toBe("string");

    const second = await history(senderToken, {
      limit: 2,
      sort: "desc",
      cursor,
    });

    expect(second.status).toBe(200);

    const secondIds = second.body.data.transactions.map(
      (transaction: { _id: string }) =>
        transaction._id
    );

    expect(secondIds).toHaveLength(1);

    const allIds = [...firstIds, ...secondIds];

    expect(new Set(allIds).size).toBe(3);

    expect(allIds).toEqual([
      transferId,
      withdrawalId,
      depositId,
    ]);

    expect(
      second.body.data.pagination.hasMore
    ).toBe(false);

    expect(
      second.body.data.pagination.nextCursor
    ).toBeNull();
  });

  // ==========================================
  // TEST 14: DATE RANGE FILTER
  // ==========================================

  it("filters transactions by date range", async () => {
    const fromDate = new Date(
      Date.now() + 86400000
    ).toISOString();

    const toDate = new Date(
      Date.now() + 172800000
    ).toISOString();

    const response = await history(senderToken, {
      fromDate,
      toDate,
    });

    expect(response.status).toBe(200);

    expect(
      response.body.data.transactions
    ).toHaveLength(0);

    expect(
      response.body.data.pagination.hasMore
    ).toBe(false);
  });

  // ==========================================
  // TEST 15: INVALID LIMIT
  // ==========================================

  it("rejects invalid pagination limit", async () => {
    const response = await history(senderToken, {
      limit: 500,
    });

    expect(response.status).toBe(400);
  });

  // ==========================================
  // TEST 16: INVALID CURSOR
  // ==========================================

  it("rejects invalid pagination cursor", async () => {
    const response = await history(senderToken, {
      cursor: "invalid-cursor",
    });

    expect(response.status).toBe(400);
  });

  // ==========================================
  // TEST 17: TRANSACTION DETAILS
  // ==========================================

  it("returns transaction details to both participants", async () => {
    const senderResponse = await details(
      transferId,
      senderToken
    );

    const receiverResponse = await details(
      transferId,
      receiverToken
    );

    expect(senderResponse.status).toBe(200);
    expect(receiverResponse.status).toBe(200);

    expect(senderResponse.body.data._id)
      .toBe(transferId);

    expect(receiverResponse.body.data._id)
      .toBe(transferId);

    expect(senderResponse.body.data.amount)
      .toBe(100000);
  });

  // ==========================================
  // TEST 18: IDOR PROTECTION
  // ==========================================

  it("prevents unauthorized transaction access", async () => {
    const response = await details(
      transferId,
      outsiderToken
    );

    expect(response.status).toBe(404);

    const missing = await details(
      new Types.ObjectId().toString(),
      outsiderToken
    );

    expect(missing.status).toBe(404);
  });

  // ==========================================
  // TEST 19: AUTHENTICATION
  // ==========================================

  it("rejects unauthenticated history and details requests", async () => {
    const historyResponse = await request(app)
      .get(BASE_URL);

    const detailsResponse = await request(app)
      .get(`${BASE_URL}/${transferId}`);

    expect(historyResponse.status).toBe(401);
    expect(detailsResponse.status).toBe(401);
  });

  // ==========================================
  // TEST 20: DATA PRIVACY
  // ==========================================

  it("does not expose internal transaction fields", async () => {
    const response = await history();

    expect(response.status).toBe(200);

    for (const transaction of response.body.data.transactions) {
      expect(transaction).not.toHaveProperty("requestHash");
      expect(transaction).not.toHaveProperty("idempotencyKey");
      expect(transaction).not.toHaveProperty("userId");
      expect(transaction).not.toHaveProperty("__v");
    }

    const detailResponse = await details(transferId);

    expect(detailResponse.status).toBe(200);

    expect(detailResponse.body.data)
      .not.toHaveProperty("requestHash");

    expect(detailResponse.body.data)
      .not.toHaveProperty("idempotencyKey");

    expect(detailResponse.body.data)
      .not.toHaveProperty("userId");
  });
});
