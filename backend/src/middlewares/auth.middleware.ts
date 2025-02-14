import { NextFunction, Request, Response } from "express";
import { verifyAccessToken, verifyRefreshToken } from "../utils/jwt.util";
import { CustomRequest } from "../core/types/CustomRequest";
import { UserRole } from "../core/types/UserTypes";

export const authenticate = (roles: Array<UserRole>) => {
  return (req: CustomRequest, res: Response, next: NextFunction): void => {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        res.status(401).json({ message: "Access token not found" });
        return;
      }

      const decoded = verifyAccessToken(token);

      req.user = decoded;

      if (roles.length && (!req.user || !roles.includes(req.user.role))) {
        res.status(403).json({ message: "Permission denied" });
        return;
      }
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid or expired access token", error });
    }
  };
};

export const validateRefreshToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      res.status(403).json({ message: "Refresh token not found" });
      return;
    }

    const decoded = verifyRefreshToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired refresh token", error });
  }
};
