
import mongoose from "mongoose";
import { env } from "../config/env.js";
import { User } from "../modules/users/user.model.js";
import { Account } from "../modules/account/account.model.js";

async function main() {
  if (process.env.NODE_ENV !== "test") {
    throw new Error("This verification must run in test mode");
  }

  const databaseName = new URL(env.MONGODB_URI)
    .pathname.replace(/^\//, "");

  if (databaseName !== "finledger_test") {
    throw new Error("Unsafe database selected");
  }

  await mongoose.connect(env.MONGODB_URI);

  try {
    const users = await User.find().select(
      "_id activeAccountCount"
    );

    let mismatches = 0;

    for (const user of users) {
      const actual = await Account.countDocuments({
        userId: user._id,
        status: { $in: ["ACTIVE", "FROZEN"] },
      });

      if (actual !== user.activeAccountCount) {
        mismatches++;

        console.error("Counter mismatch:", {
          userId: user._id.toString(),
          expected: actual,
          stored: user.activeAccountCount,
        });
      }
    }

    console.log("Users checked:", users.length);
    console.log("Counter mismatches:", mismatches);

    if (mismatches > 0) {
      process.exitCode = 1;
    }
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
