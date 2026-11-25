import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

import {
  createAccount,
  getUserAccounts,
  getAccountById,
  freezeAccount,
  unfreezeAccount,
  closeAccount,
} from "./account.service.js";

import {
  createAccountSchema,
  accountIdSchema,
} from "./account.validation.js";


// Create a new banking account
export const createBankAccount = asyncHandler(
  async (req, res) => {
    const userId = req.user?.id;

    if (!userId) {
      throw new ApiError(
        401,
        "Authentication required"
      );
    }

    const result = createAccountSchema.safeParse(
      req.body
    );

    if (!result.success) {
      throw new ApiError(
        400,
        "Validation failed",
        result.error.issues
      );
    }

    const account = await createAccount(
      userId,
      result.data
    );

    return res.status(201).json(
      new ApiResponse(
        201,
        account,
        "Account created successfully"
      )
    );
  }
);


// Get all accounts of authenticated user
export const getMyAccounts = asyncHandler(
  async (req, res) => {
    const userId = req.user?.id;

    if (!userId) {
      throw new ApiError(
        401,
        "Authentication required"
      );
    }

    const accounts = await getUserAccounts(
      userId
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        accounts,
        "Accounts fetched successfully"
      )
    );
  }
);


// Get details of a specific account
export const getBankAccount = asyncHandler(
  async (req, res) => {
    const userId = req.user?.id;

    if (!userId) {
      throw new ApiError(
        401,
        "Authentication required"
      );
    }

    const result = accountIdSchema.safeParse(
      req.params.accountId
    );

    if (!result.success) {
      throw new ApiError(
        400,
        "Invalid account ID",
        result.error.issues
      );
    }

    const account = await getAccountById(
      userId,
      result.data
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        account,
        "Account fetched successfully"
      )
    );
  }
);  

export const freezeBankAccount = asyncHandler(
  async (req, res) => {
    const accountId = accountIdSchema.parse(
      req.params.accountId
    );

    const account = await freezeAccount(accountId);

    return res.status(200).json(
      new ApiResponse(
        200,
        account,
        "Account frozen successfully"
      )
    );
  }
);

export const unfreezeBankAccount = asyncHandler(
  async (req, res) => {
    const accountId = accountIdSchema.parse(
      req.params.accountId
    );

    const account = await unfreezeAccount(accountId);

    return res.status(200).json(
      new ApiResponse(
        200,
        account,
        "Account unfrozen successfully"
      )
    );
  }
);

export const closeBankAccount = asyncHandler(
  async (req, res) => {
    const userId = req.user?.id;

    if (!userId) {
      throw new ApiError(401, "Authentication required");
    }

    const result = accountIdSchema.safeParse(
      req.params.accountId
    );

    if (!result.success) {
      throw new ApiError(400, "Invalid account ID");
    }

    const account = await closeAccount(
      userId,
      result.data
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        account,
        "Account closed successfully"
      )
    );
  }
);