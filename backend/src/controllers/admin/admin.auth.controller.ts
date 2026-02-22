import type { Request, Response } from "express";

import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { IAdminAuthController } from "@/core/interfaces/controllers/admin/i-admin-auth-controller";
import type { LoginRequestDTO } from "@/dtos/requests/auth.dto";
import type { AdminAuthService } from "@/services/admin/admin.auth.service";

import { TYPES } from "@/di/types";
import { MESSAGES } from "@/utils/constants/message";
import { clearRefreshTokenCookie, setRefreshTokenCookie } from "@/utils/cookie-utils";
import CustomError from "@/utils/custom-error";
import { generateAccessToken, verifyAccessToken } from "@/utils/jwt.util";

const { ADMIN_MESSAGES } = MESSAGES;

@injectable()
export class AdminAuthController implements IAdminAuthController {
  constructor(@inject(TYPES.AdminAuthService) private adminAuthService: AdminAuthService) {}

  login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const loginDto = req.body as LoginRequestDTO;
    const user = await this.adminAuthService.login(loginDto);

    if (!user) {
      throw new CustomError(ADMIN_MESSAGES.INVALID_CREDENTIALS, StatusCodes.UNAUTHORIZED);
    }

    setRefreshTokenCookie(res, { _id: user._id.toString(), role: "admin" });

    const accessToken = generateAccessToken({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: "admin",
    });

    res.status(StatusCodes.OK).json({ message: ADMIN_MESSAGES.LOGIN_SUCCESS, accessToken, user });
  });

  logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    clearRefreshTokenCookie(res);
    res.status(StatusCodes.OK).json({ message: ADMIN_MESSAGES.LOGOUT_SUCCESS });
  });

  verifyToken = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      throw new CustomError(ADMIN_MESSAGES.ACCESS_TOKEN_MISSING, StatusCodes.UNAUTHORIZED);
    }

    const payload = verifyAccessToken(accessToken);

    if (!payload) {
      throw new CustomError(ADMIN_MESSAGES.ACCESS_TOKEN_INVALID, StatusCodes.FORBIDDEN);
    }

    const user = await this.adminAuthService.findUserByEmail(payload.user.email);

    if (!user) {
      throw new CustomError(ADMIN_MESSAGES.ACCESS_TOKEN_INVALID, StatusCodes.FORBIDDEN);
    }

    res.status(StatusCodes.OK).json(payload.user);
  });
}
