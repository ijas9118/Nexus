import type { Request } from "express";

import rateLimit from "express-rate-limit";
import { StatusCodes } from "http-status-codes";

/**
 * Rate limiter for connection requests
 * Limits users to 20 connection requests per hour
 * Admin users bypass this limit
 */
export const connectionRequestLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour in milliseconds
  max: 20, // Limit each user to 20 requests per windowMs
  message: {
    success: false,
    message: "Too many connection requests. Please try again later.",
    retryAfter: "1 hour",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Key generator: use authenticated user's ID
  keyGenerator: (req: Request) => {
    // The user object is attached by the authenticate middleware
    const userId = (req as any).user?.userId || (req as any).user?.id || req.ip;
    return userId?.toString() || req.ip || "anonymous";
  },
  // Skip rate limiting for admin users
  skip: (req: Request) => {
    const userRole = (req as any).user?.role;
    return userRole === "admin";
  },
  // Handler for when limit is exceeded
  handler: (req, res) => {
    res.status(StatusCodes.TOO_MANY_REQUESTS).json({
      success: false,
      message: "Too many connection requests. Please try again later.",
      retryAfter: "1 hour",
    });
  },
});

/**
 * General purpose rate limiter that can be configured
 * @param windowMs - Time window in milliseconds
 * @param max - Maximum number of requests per window
 * @param message - Custom error message
 * @returns Rate limiter middleware
 */
export function createCustomRateLimiter(
  windowMs: number,
  max: number,
  message: string = "Too many requests. Please try again later.",
) {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message,
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req: Request) => {
      const userId = (req as any).user?.userId || (req as any).user?.id || req.ip;
      return userId?.toString() || req.ip || "anonymous";
    },
    skip: (req: Request) => {
      const userRole = (req as any).user?.role;
      return userRole === "admin";
    },
    handler: (req, res) => {
      res.status(StatusCodes.TOO_MANY_REQUESTS).json({
        success: false,
        message,
      });
    },
  });
}
