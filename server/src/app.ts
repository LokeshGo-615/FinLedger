
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import { env } from "./config/env.js";

import authRoutes from "./modules/auth/auth.routes.js";
import accountRoutes from "./modules/account/account.routes.js";

import { ApiResponse } from "./utils/ApiResponse.js";
import { ApiError } from "./utils/ApiError.js";
import { errorHandler } from "./middleware/error.middleware.js";
import transactionRoutes from "./modules/transactions/transaction.routes.js"

import { globalRateLimiter } from "./middleware/distributedRateLimit.js";

const app = express();

// 1. Security headers
app.use(helmet());

// 2. CORS must run BEFORE API routes
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 3. Parse incoming JSON requests
app.use(express.json({ limit: "10kb" }));

// 4. Parse cookies
app.use(cookieParser());

// 5. Health check
app.get("/api/v1/health", (_req, res) => {
  res.status(200).json(
    new ApiResponse(
      200,
      { timestamp: new Date().toISOString() },
      "FinLedger API is running"
    )
  );
});

// 6. API routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/accounts", accountRoutes);
app.use("/api/v1", globalRateLimiter);

app.use(
  "/api/v1/transactions",
  transactionRoutes
);

// 7. Handle unknown routes
app.use((_req, _res, next) => {
  next(new ApiError(404, "Route not found"));
});

// 8. Global error handler (always last)
app.use(errorHandler);

export default app;
