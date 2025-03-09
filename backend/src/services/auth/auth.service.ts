import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import { IUserRepository } from '../../core/interfaces/repositories/IUserRepository';
import { LoginDto } from '../../dtos/requests/auth/login.dto';
import { RegisterDto } from '../../dtos/requests/auth/register.dto';
import { compare, hash } from 'bcrypt';
import { RegisterResponseDto } from '../../dtos/responses/auth/registerResponse.dto';
import { LoginResponseDto } from '../../dtos/responses/auth/loginResponse.dto';
import { generateRefreshToken } from '../../utils/jwt.util';
import redisClient from '../../config/redisClient.config';
import { IAuthService } from '../../core/interfaces/services/IAuthService';
import CustomError from '../../utils/CustomError';
import { StatusCodes } from 'http-status-codes';
import { UsernameGenerator } from '../../utils/usernameGenerator.util';

@injectable()
export class AuthService implements IAuthService {
  constructor(@inject(TYPES.UserRepository) private userRepository: IUserRepository) {}

  // Check if a user with the given email exists
  async findUserByEmail(email: string): Promise<boolean> {
    const user = await this.userRepository.findByEmail(email);
    return !!user;
  }

  // Register a new user with the given details
  async register(registerDto: RegisterDto): Promise<RegisterResponseDto> {
    const { name, email, password } = registerDto;
    const hashedPassword = await hash(password, 10);
    const username = UsernameGenerator.generateUsername();
    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      username,
    });

    await redisClient.del(`otp:${email}`);

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      username,
    };
  }

  // Login a user with the given email and password
  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = loginDto;
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new CustomError('Invalid email or password', StatusCodes.BAD_REQUEST);
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new CustomError('Invalid password', StatusCodes.BAD_REQUEST);
    }

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      username: user.username,
      profilePic: user.profilePic,
    };
  }

  // Update the password of the user with the given email
  async updatePassword(email: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      throw new CustomError('User not found', StatusCodes.NOT_FOUND);
    }

    const hashedPassword = await hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    await redisClient.del(`forgotPassword:${email}`);
  }

  // Get a user by role and id from the database (used for token verification)
  async getUserByRoleAndId(role: string, id: string) {
    return this.userRepository.getUserByRoleAndId(role, id);
  }

  async googleLoginOrRegister(userData: {
    name: string;
    email: string;
  }): Promise<LoginResponseDto | null> {
    const { name, email } = userData;

    let user = await this.userRepository.findByEmail(email);

    if (!user) {
      user = await this.userRepository.create({ name, email, password: '123456789' });
    }

    const data = {
      _id: user._id,
      email: user.email,
      name: user.name,
    };

    const refreshToken = generateRefreshToken(data);

    const key = `refreshToken:${user._id}`;
    await redisClient.set(key, refreshToken, 'EX', 7 * 24 * 60 * 60);

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: 'user',
      username: user.username,
    };
  }
}
