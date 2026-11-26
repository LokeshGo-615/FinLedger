
import type {
  Request,
  Response,
} from "express";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

import {
  depositSchema,
  withdrawalSchema,
  transferSchema,
  transactionHistorySchema,
  transactionIdSchema,
} from "./transaction.validation.js";

import {
  depositMoney,
  withdrawMoney,
  transferMoney,
  getTransactionHistory,
  getTransactionById,
} from "./transaction.service.js";


export const depositController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }

    const parsed = depositSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new ApiError(400, "Invalid deposit request");
    }

    const idempotencyKey =
      req.header("Idempotency-Key");

    if (
      !idempotencyKey ||
      !/^[A-Za-z0-9_-]{8,128}$/.test(idempotencyKey)
    ) {
      throw new ApiError(
        400,
        "Valid Idempotency-Key header required"
      );
    }

    const transaction = await depositMoney(
      req.user.id,
      parsed.data,
      idempotencyKey
    );

    res.status(200).json(
      new ApiResponse(
        200,
        {
          id: transaction._id.toString(),
          type: transaction.type,
          amount: transaction.amount,
          currency: transaction.currency,
          status: transaction.status,
          createdAt: transaction.createdAt,
        },
        "Deposit completed successfully"
      )
    );
  }
);


export const withdrawalController = asyncHandler(
  async (req: Request, res: Response) => {

    if (!req.user) {
      throw new ApiError(
        401,
        "Authentication required"
      );
    }

    const parsed = withdrawalSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new ApiError(
        400,
        "Invalid withdrawal request"
      );
    }

    const idempotencyKey =
      req.header("Idempotency-Key");

    if (
      !idempotencyKey ||
      !/^[A-Za-z0-9_-]{8,128}$/.test(idempotencyKey)
    ) {
      throw new ApiError(
        400,
        "Valid Idempotency-Key header required"
      );
    }

    const transaction = await withdrawMoney(
      req.user.id,
      parsed.data,
      idempotencyKey
    );

    res.status(200).json(
      new ApiResponse(
        200,
        {
          id: transaction._id.toString(),
          type: transaction.type,
          amount: transaction.amount,
          currency: transaction.currency,
          status: transaction.status,
          createdAt: transaction.createdAt,
        },
        "Withdrawal completed successfully"
      )
    );
  }
);



export const transferController = asyncHandler(
  async (req: Request, res: Response) => {

    if (!req.user) {
      throw new ApiError(
        401,
        "Authentication required"
      );
    }

    const parsed = transferSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new ApiError(
        400,
        "Invalid transfer request"
      );
    }

    const idempotencyKey = req.header(
      "Idempotency-Key"
    );

    if (
      !idempotencyKey ||
      !/^[A-Za-z0-9_-]{8,128}$/.test(idempotencyKey)
    ) {
      throw new ApiError(
        400,
        "Valid Idempotency-Key header required"
      );
    }

    const transaction = await transferMoney(
      req.user.id,
      parsed.data,
      idempotencyKey
    );

    res.status(200).json(
      new ApiResponse(
        200,
        {
          id: transaction._id.toString(),
          type: transaction.type,
          sourceAccountId: transaction.sourceAccountId,
          destinationAccountId: transaction.destinationAccountId,
          amount: transaction.amount,
          currency: transaction.currency,
          status: transaction.status,
          createdAt: transaction.createdAt,
        },
        "Transfer completed successfully"
      )
    );
  }
);


export const getTransactionHistoryController =
  asyncHandler(async (req: Request, res: Response) => {

    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }

    const parsed = transactionHistorySchema.safeParse(
      req.query
    );

    if (!parsed.success) {
      throw new ApiError(
        400,
        "Invalid transaction history filters"
      );
    }

    const result = await getTransactionHistory(
      req.user.id,
      parsed.data
    );

    res.status(200).json(
      new ApiResponse(
        200,
        result,
        "Transaction history fetched successfully"
      )
    );
  });

export const getTransactionByIdController =
  asyncHandler(async (req: Request, res: Response) => {

    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }

    const parsed = transactionIdSchema.safeParse(
      req.params.transactionId
    );

    if (!parsed.success) {
      throw new ApiError(400, "Invalid transaction ID");
    }

    const transaction = await getTransactionById(
      req.user.id,
      parsed.data
    );

    res.status(200).json(
      new ApiResponse(
        200,
        transaction,
        "Transaction fetched successfully"
      )
    );
  });

