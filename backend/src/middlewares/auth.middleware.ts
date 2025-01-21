import { NextFunction, Request, Response } from "express";
import { verifyAccessToken, verifyRefreshToken } from "../utils/jwt.util";
import { CustomRequest } from "../core/types/CustomRequest";

export const authenticate = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      res.status(401).json({ message: "Access token not found" });
      return;
    }

    const decoded = verifyAccessToken(token);
    console.log(typeof decoded.user)
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired access token", error });
  }
};

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
