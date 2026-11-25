
import mongoose from "mongoose";

import { env } from "../config/env.js";
import { User } from "../modules/users/user.model.js";
import { Account } from "../modules/account/account.model.js";

async function migrateAccountCounts() {
  await mongoose.connect(env.MONGODB_URI);

  try {
    const users = await User.find().select("_id");

    for (const user of users) {
      const count = await Account.countDocuments({
        userId: user._id,
        status: { $in: ["ACTIVE", "FROZEN"] },
      });

      if (count > 5) {
        throw new Error(
          `User ${user._id} already has ${count} open accounts`
        );
      }

      await User.updateOne(
        { _id: user._id },
        { $set: { activeAccountCount: count } }
      );

      console.log(`Migrated ${user._id}: ${count}`);
    }

    console.log("Account counter migration completed");
  } finally {
    await mongoose.disconnect();
  }
}

migrateAccountCounts().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
