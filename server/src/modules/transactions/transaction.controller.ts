
import type {
  Request,
  Response,
} from "express";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

import { depositSchema } from "./transaction.validation.js";
import { depositMoney } from "./transaction.service.js";

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
