import type { NextFunction, Request, Response } from "express";

import { StatusCodes } from "http-status-codes";

import type { UserRole } from "@/core/types/user-types";

import logger from "@/config/logger";

import { verifyAccessToken, verifyRefreshToken } from "../utils/jwt.util";

export function authenticate(roles: Array<UserRole>) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "Access token not found" });
        return;
      }

      const decoded = verifyAccessToken(token);
      req.user = decoded;

      if (roles.length && (!req.user || !roles.includes(req.user.role))) {
        logger.debug(req.user.role, roles);
        res.status(StatusCodes.FORBIDDEN).json({ message: "Permission denied" });
        return;
      }
      next();
    }
    catch (error) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid or expired access token", error });
    }
  };
}

export function validateRefreshToken(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      logger.warn(`Refresh token missing. Origin: ${req.headers.origin || "Unknown"}. Cookies received: ${Object.keys(req.cookies).join(", ") || "None"}`);
      res.status(StatusCodes.FORBIDDEN).json({ message: "Refresh token not found" });
      return;
    }

    const decoded = verifyRefreshToken(token);
    req.user = decoded;
    next();
  }
  catch (error) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Invalid or expired refresh token", error });
  }
}
