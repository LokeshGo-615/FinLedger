import process from "node:process";

import app from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase } from "./config/database.js";

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    app.listen(env.PORT, () => {
      console.log(
        `FinLedger server running on port ${env.PORT}`
      );
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

void startServer();