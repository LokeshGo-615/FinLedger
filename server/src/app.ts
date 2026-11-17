import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./modules/auth/auth.routes.js";
import { env } from "./config/env.js";
import { ApiResponse } from "./utils/ApiResponse.js";
import { ApiError } from "./utils/ApiError.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(helmet());

app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true
}));

app.use(express.json({ limit: "10kb" }));
    
app.use("/api/v1/auth", authRoutes);

app.get("/api/v1/health", (_req, res) => {
  res.status(200).json(
    new ApiResponse(
      200,
      { timestamp: new Date().toISOString() },
      "FinLedger API is running"
    )
  );
});

app.use((_req, _res, next) => {
  next(new ApiError(404, "Route not found"));
});

app.use(errorHandler);

export default app;