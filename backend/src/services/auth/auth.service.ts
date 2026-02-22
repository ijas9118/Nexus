import { compare, hash } from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { IUserRepository } from "@/core/interfaces/repositories/i-user-repository";
import type { IAuthService } from "@/core/interfaces/services/i-auth-service";
import type { IMentorService } from "@/core/interfaces/services/i-mentor-service";
import type { UserRole } from "@/core/types/user-types";
import type { LoginRequestDTO, RegisterRequestDTO } from "@/dtos/requests/auth.dto";
import type { IUser } from "@/models/user/user.model";

import redisClient from "@/config/redis-client.config";
import { TYPES } from "@/di/types";
import { LoginResponseDTO, RegisterResponseDTO } from "@/dtos/responses/auth.dto";
import { MESSAGES } from "@/utils/constants/message";
import CustomError from "@/utils/custom-error";
import { generateAccessToken, verifyRefreshToken } from "@/utils/jwt.util";
import { UsernameGenerator } from "@/utils/username-generator.util";

const { AUTH_MESSAGES, ADMIN_MESSAGES } = MESSAGES;

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.UserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.MentorService) private _mentorService: IMentorService,
  ) {}

  // Check if a user with the given email exists
  async findUserByEmail(email: string): Promise<boolean> {
    const user = await this._userRepository.findByEmail(email);
    return !!user;
  }

  // Register a new user with the given details
  async register(registerDto: RegisterRequestDTO): Promise<{ user: RegisterResponseDTO; accessToken: string }> {
    const { name, email, password } = registerDto;
    const hashedPassword = await hash(password, 10);
    const username = await UsernameGenerator.generateUsername(
      name,
      async u => !!(await this._userRepository.getUserByUsername(u)),
    );

    const user = await this._userRepository.create({
      name,
      email,
      password: hashedPassword,
      username,
    });

    const userData = RegisterResponseDTO.fromEntity(user);
    const accessToken = generateAccessToken({ ...user });

    await redisClient.del(`otp:${email}`);

    return { user: userData, accessToken };
  }

  // Login a user with the given email and password
  async login(data: LoginRequestDTO): Promise<{ user: LoginResponseDTO; accessToken: string }> {
    const { email, password } = data;
    const user = await this._userRepository.findByEmail(email);

    if (!user) {
      throw new CustomError(ADMIN_MESSAGES.INVALID_CREDENTIALS, StatusCodes.BAD_REQUEST);
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new CustomError(AUTH_MESSAGES.INVALID_PASSWORD, StatusCodes.BAD_REQUEST);
    }

    const isBlocked = await this.isUserBlocked(user._id.toString());
    if (isBlocked) {
      throw new CustomError(AUTH_MESSAGES.USER_BLOCKED, StatusCodes.FORBIDDEN);
    }

    let userObj = user.toObject();

    if (user.role === "mentor") {
      const mentor = await this._mentorService.getMentorByUserId(user._id.toString());
      if (mentor) {
        const mentorWithId = mentor as { _id: string };
        userObj.mentorId = mentorWithId._id.toString();
      }
    }

    const accessToken = generateAccessToken({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      mentorId: userObj.mentorId,
      role: user.role as UserRole,
    });

    userObj = LoginResponseDTO.fromEntity(userObj);

    return { user: userObj, accessToken };
  }

  // Update the password of the user with the given email
  async updatePassword(email: string, newPassword: string): Promise<void> {
    const user = await this._userRepository.findOne({ email });
    if (!user) {
      throw new CustomError(AUTH_MESSAGES.USER_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    const hashedPassword = await hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    await redisClient.del(`forgotPassword:${email}`);
  }

  // Get a user by role and id from the database (used for token verification)
  async getUserByRoleAndId(role: string, id: string): Promise<IUser | null> {
    return this._userRepository.getUserByRoleAndId(role, id);
  }

  async isUserBlocked(userId: string): Promise<boolean> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new CustomError(AUTH_MESSAGES.USER_NOT_FOUND, StatusCodes.NOT_FOUND);
    }
    return user.isBlocked || false;
  }

  async handleGoogleUser(googleData: {
    googleId: string;
    email: string;
    name: string;
    profile: string;
  }): Promise<IUser> {
    let user = await this._userRepository.findByGoogleId(googleData.googleId);

    if (!user) {
      user = await this._userRepository.findByEmail(googleData.email);

      if (!user) {
        const dummyPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await hash(dummyPassword, 10);

        const username = await UsernameGenerator.generateUsername(
          googleData.name,
          async u => !!(await this._userRepository.getUserByUsername(u)),
        );

        user = await this._userRepository.create({
          googleId: googleData.googleId,
          name: googleData.name,
          email: googleData.email,
          password: hashedPassword,
          username,
          profilePic: googleData.profile,
          role: "user",
        });
      }
      else {
        user.googleId = googleData.googleId;
        await user.save();
      }
    }

    return user;
  }

  async handleGithubUser(githubData: {
    githubId: string;
    email: string;
    name: string;
    profile: string;
  }): Promise<IUser> {
    let user = await this._userRepository.findByGithubId(githubData.githubId);

    if (!user) {
      user = await this._userRepository.findByEmail(githubData.email);

      if (!user) {
        const dummyPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await hash(dummyPassword, 10);

        const username = await UsernameGenerator.generateUsername(
          githubData.name,
          async u => !!(await this._userRepository.getUserByUsername(u)),
        );

        user = await this._userRepository.create({
          githubId: githubData.githubId,
          name: githubData.name,
          email: githubData.email,
          password: hashedPassword,
          username,
          profilePic: githubData.profile,
          role: "user",
        });
      }
      else {
        user.githubId = githubData.githubId;
        await user.save();
      }
    }

    return user;
  }

  async refreshToken(token: string): Promise<{ accessToken: string; user: any }> {
    const decodedToken = verifyRefreshToken(token);
    if (!decodedToken) {
      throw new CustomError(AUTH_MESSAGES.REFRESH_TOKEN_INVALID, StatusCodes.FORBIDDEN);
    }

    const isBlocked = await redisClient.get(`blocked_user:${decodedToken.user._id}`);
    if (isBlocked) {
      throw new CustomError(AUTH_MESSAGES.USER_BLOCKED, StatusCodes.FORBIDDEN);
    }

    const { _id, name, email, role } = decodedToken.user;

    if (role === "admin") {
      const accessToken = generateAccessToken({ _id, name, email, role });
      return { accessToken, user: decodedToken.user };
    }

    const user = await this.getUserByRoleAndId(role, _id);

    if (!user) {
      throw new CustomError(AUTH_MESSAGES.USER_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    const payload: any = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role,
    };

    let fullUser = user.toObject ? user.toObject() : user;

    if (role === "mentor") {
      const mentor = await this._mentorService.getMentorByUserId(user._id.toString());
      if (!mentor) {
        throw new CustomError(AUTH_MESSAGES.MENTOR_NOT_FOUND, StatusCodes.NOT_FOUND);
      }

      const mentorWithId = mentor as { _id: string };
      payload.mentorId = mentor._id;
      fullUser = { ...fullUser, mentorId: mentorWithId._id.toString() };
    }

    const accessToken = generateAccessToken(payload);

    return { accessToken, user: fullUser };
  }
}
