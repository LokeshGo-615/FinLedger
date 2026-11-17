
import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDatabase = async (): Promise<void> => {
  const connection = await mongoose.connect(
    env.MONGODB_URI
  );

  console.log(
    `MongoDB connected: ${connection.connection.host}`
  );
};