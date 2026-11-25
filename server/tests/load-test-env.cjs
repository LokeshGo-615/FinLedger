const path = require("node:path");
const dotenv = require("dotenv");

process.env.NODE_ENV = "test";

dotenv.config({
  path: path.resolve(process.cwd(), ".env.test"),
  override: true,
});

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Test MONGODB_URI is missing");
}

const databaseName = new URL(uri).pathname.replace(/^\//, "");

if (databaseName !== "finledger_test") {
  throw new Error(
    "Refusing to run tests outside finledger_test database"
  );
}