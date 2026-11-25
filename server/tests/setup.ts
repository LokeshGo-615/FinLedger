import mongoose from "mongoose";
import { afterAll, beforeAll , } from "@jest/globals";


beforeAll(async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing");
  }

  const databaseName = new URL(mongoUri).pathname
    .replace(/^\//, "");

  if (databaseName !== "finledger_test") {
    throw new Error(
      "Tests must use the finledger_test database"
    );
  }

  await mongoose.connect(mongoUri);
  if (mongoose.connection.db?.databaseName !== "finledger_test") {
  throw new Error("Unsafe test database connection");
}
  console.log("Connected to FinLedger test database");
});

afterAll(async () => {
  await mongoose.disconnect();
});