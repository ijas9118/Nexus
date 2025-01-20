import { NextFunction, Request, Response } from "express";
import { verifyRefreshToken } from "../utils/jwt.util";
import { JwtPayload } from "jsonwebtoken";

interface CustomRequest extends Request {
  user?: string | JwtPayload;
}

export const validateRefreshToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      res.status(401).json({ message: "Refresh token not found" });
      return;
    }

    const decoded = verifyRefreshToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired refresh token", error });
  }
};
