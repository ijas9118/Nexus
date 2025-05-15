import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import { IUserRepository } from '../../core/interfaces/repositories/IUserRepository';
import { compare, hash } from 'bcryptjs';
import redisClient from '../../config/redisClient.config';
import { IAuthService } from '../../core/interfaces/services/IAuthService';
import CustomError from '../../utils/CustomError';
import { StatusCodes } from 'http-status-codes';
import { UsernameGenerator } from '../../utils/usernameGenerator.util';
import { IUser } from '../../models/user.model';
import { IMentorService } from '@/core/interfaces/services/IMentorService';
import { LoginRequestDTO, RegisterRequestDTO } from '@/dtos/requests/auth.dto';
import { LoginResponseDTO, RegisterResponseDTO } from '@/dtos/responses/auth.dto';

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.MentorService) private mentorService: IMentorService
  ) {}

  // Check if a user with the given email exists
  async findUserByEmail(email: string): Promise<boolean> {
    const user = await this.userRepository.findByEmail(email);
    return !!user;
  }

  // Register a new user with the given details
  async register(registerDto: RegisterRequestDTO): Promise<RegisterResponseDTO> {
    const { name, email, password } = registerDto;
    const hashedPassword = await hash(password, 10);
    const username = await UsernameGenerator.generateUsername(
      name,
      async (u) => !!(await this.userRepository.getUserByUsername(u))
    );

    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      username,
    });

    const userData = RegisterResponseDTO.fromEntity(user);

    await redisClient.del(`otp:${email}`);

    return userData;
  }

  // Login a user with the given email and password
  async login(data: LoginRequestDTO): Promise<LoginResponseDTO> {
    const { email, password } = data;
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new CustomError('Invalid email or password', StatusCodes.BAD_REQUEST);
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new CustomError('Invalid password', StatusCodes.BAD_REQUEST);
    }

    let userObj = user.toObject();

    if (user.role === 'mentor') {
      const mentor = await this.mentorService.getMentorByUserId(user._id.toString());
      if (mentor) {
        const mentorWithId = mentor as { _id: string };
        userObj.mentorId = mentorWithId._id.toString();
      }
    }

    userObj = LoginResponseDTO.fromEntity(userObj);

    return userObj;
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
  async getUserByRoleAndId(role: string, id: string): Promise<IUser | null> {
    return this.userRepository.getUserByRoleAndId(role, id);
  }

  async handleGoogleUser(googleData: {
    googleId: string;
    email: string;
    name: string;
    profile: string;
  }): Promise<IUser> {
    let user = await this.userRepository.findByGoogleId(googleData.googleId);

    if (!user) {
      user = await this.userRepository.findByEmail(googleData.email);

      if (!user) {
        const dummyPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await hash(dummyPassword, 10);

        const username = await UsernameGenerator.generateUsername(
          googleData.name,
          async (u) => !!(await this.userRepository.getUserByUsername(u))
        );

        user = await this.userRepository.create({
          googleId: googleData.googleId,
          name: googleData.name,
          email: googleData.email,
          password: hashedPassword,
          username: username,
          profilePic: googleData.profile,
          role: 'user',
        });
      } else {
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
    let user = await this.userRepository.findByGithubId(githubData.githubId);

    if (!user) {
      user = await this.userRepository.findByEmail(githubData.email);

      if (!user) {
        const dummyPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await hash(dummyPassword, 10);

        const username = await UsernameGenerator.generateUsername(
          githubData.name,
          async (u) => !!(await this.userRepository.getUserByUsername(u))
        );

        user = await this.userRepository.create({
          githubId: githubData.githubId,
          name: githubData.name,
          email: githubData.email,
          password: hashedPassword,
          username: username,
          profilePic: githubData.profile,
          role: 'user',
        });
      } else {
        user.githubId = githubData.githubId;
        await user.save();
      }
    }

    return user;
  }
}
