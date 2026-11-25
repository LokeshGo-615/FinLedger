
import { Types, type ClientSession } from "mongoose";

import { User } from "../users/user.model.js";
import { ApiError } from "../../utils/ApiError.js";

import { MAX_ACCOUNTS_PER_USER } from "./account.constants.js";

export async function reserveAccountSlot(
  userId: string,
  session: ClientSession
): Promise<void> {
  const result = await User.findOneAndUpdate(
    {
      _id: new Types.ObjectId(userId),
      activeAccountCount: {
        $gte: 0,
        $lt: MAX_ACCOUNTS_PER_USER,
      },
    },
    {
      $inc: {
        activeAccountCount: 1,
      },
    },
    {
      session,
      new: true,
      runValidators: true,
    }
  );

  if (!result) {
    throw new ApiError(
      409,
      `Maximum ${MAX_ACCOUNTS_PER_USER} accounts allowed`
    );
  }
}

