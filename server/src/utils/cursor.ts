
import { Types } from "mongoose";
import { ApiError } from "./ApiError.js";

interface CursorData {
  createdAt: string;
  id: string;
}

export function encodeCursor(
  createdAt: Date,
  id: string
): string {
  const data: CursorData = {
    createdAt: createdAt.toISOString(),
    id,
  };

  return Buffer.from(
    JSON.stringify(data)
  ).toString("base64url");
}

export function decodeCursor(cursor: string) {
  try {
    const data = JSON.parse(
      Buffer.from(cursor, "base64url").toString("utf8")
    ) as CursorData;

    if (
      typeof data.id !== "string" ||
      !/^[a-fA-F0-9]{24}$/.test(data.id) ||
      typeof data.createdAt !== "string"
    ) {
      throw new Error("Invalid cursor");
    }

    const createdAt = new Date(data.createdAt);

    if (Number.isNaN(createdAt.getTime())) {
      throw new Error("Invalid cursor date");
    }

    return {
      createdAt,
      id: new Types.ObjectId(data.id),
    };
  } catch {
    throw new ApiError(400, "Invalid pagination cursor");
  }
}
