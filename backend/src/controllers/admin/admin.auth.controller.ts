import { Request, Response } from "express";
import { IAdminAuthController } from "../../core/interfaces/controllers/admin/IAdminAuthController";
import { LoginDto } from "../../dtos/requests/auth/login.dto";
import { AdminAuthService } from "../../services/admin/admin.auth.service";
import { generateAccessToken, verifyAccessToken } from "../../utils/jwt.util";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { clearRefreshTokenCookie, setRefreshTokenCookie } from "../../utils/cookieUtils";
import { StatusCodes } from "http-status-codes";
import CustomError from "../../utils/CustomError";

@injectable()
export class AdminAuthController implements IAdminAuthController {
  constructor(
    @inject(TYPES.AdminAuthService) private adminAuthService: AdminAuthService
  ) {}

  login = async (req: Request, res: Response): Promise<void> => {
    const loginDto: LoginDto = req.body;
    const user = await this.adminAuthService.login(loginDto);

    console.log(user);

    if (!user) {
      throw new CustomError("Invalid email or password", StatusCodes.UNAUTHORIZED);
    }

    setRefreshTokenCookie(res, { _id: user._id.toString(), role: "admin" });

    const accessToken = generateAccessToken({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: "admin",
    });

    res.status(StatusCodes.OK).json({ message: "success", accessToken, user });
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    clearRefreshTokenCookie(res);
    res.status(StatusCodes.OK).json({ message: "Logged out successfully." });
  };

  async verifyToken(req: Request, res: Response): Promise<void> {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      throw new CustomError("Access token not found", StatusCodes.UNAUTHORIZED);
    }

    const payload = verifyAccessToken(accessToken);

    if (!payload) {
      throw new CustomError("Invalid or expired access token", StatusCodes.FORBIDDEN);
    }

    const user = await this.adminAuthService.findUserByEmail(payload.user.email);

    if (!user) {
      throw new CustomError("Invalid or expired access token", StatusCodes.FORBIDDEN);
    }

    res.status(StatusCodes.OK).json(payload.user);
  }
}
