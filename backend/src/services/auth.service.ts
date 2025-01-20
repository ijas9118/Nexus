import { injectable, inject } from "inversify";
import { TYPES } from "../di/types";
import { IUserRepository } from "../core/interfaces/repositories/IUserRepository";
import { LoginDto } from "../dtos/requests/auth/login.dto";
import { RegisterDto } from "../dtos/requests/auth/register.dto";
import { compare, hash } from "bcrypt";
import { RegisterResponseDto } from "../dtos/responses/auth/registerResponse.dto";
import { LoginResponseDto } from "../dtos/responses/auth/loginResponse.dto";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.util";

@injectable()
export class AuthService {
  constructor(@inject(TYPES.UserRepository) private userRepository: IUserRepository) {}

  async register(registerDto: RegisterDto): Promise<RegisterResponseDto> {
    const { name, email, password } = registerDto;
    const hashedPassword = await hash(password, 10);
    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      accessToken,
      refreshToken,
    };
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto | null> {
    const { email, password } = loginDto;
    const user = await this.userRepository.findByEmail(email);
    if (!user) return null;

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) return null;
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string } | null> {
    try {
      const decoded = verifyRefreshToken(refreshToken);

      const user = await this.userRepository.findById(decoded.userId);

      if (!user) throw new Error("User not found");

      const accessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      console.error("Refresh token verification failed:", error);
      return null;
    }
  }
}
