import type { Response } from "express";

import type { UserRole } from "@/core/types/user-types";

import { env } from "../utils/env-validation";
import { generateRefreshToken } from "./jwt.util";
import logger from "@/config/logger";

export function setRefreshTokenCookie(res: Response, payload: { _id: string; role: UserRole }) {
  const refreshToken = generateRefreshToken(payload);

  const isProduction = env.NODE_ENV === "production";
  
  if (isProduction) {
    logger.info("Setting secure cookies for production environment (SameSite=None)");
  } else {
    logger.warn(`Setting non-secure cookies for ${env.NODE_ENV} environment (SameSite=Lax)`);
  }

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });
}

export function clearRefreshTokenCookie(res: Response) {
  const isProduction = env.NODE_ENV === "production";

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });
}
