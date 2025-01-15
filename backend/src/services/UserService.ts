import { IUser } from "../interfaces/IUser";
import { IUserRepository } from "../repositories/Users/IUserRepository";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

export class UserService {
  constructor(private userRepository: IUserRepository) {}

  async signUp(userData: Partial<IUser>): Promise<IUser> {
    const existingUser = await this.userRepository.findUserByEmail(
      userData.email || ""
    );

    if (existingUser) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(userData.password || "", 10);

    const user = await this.userRepository.createUser({
      ...userData,
      password: hashedPassword,
    });

    // const accessToken = generateAccessToken(user._id.toString());
    // const refreshToken = generateRefreshToken(user._id.toString());

    return user;
  }

  async login(email: string, password: string): Promise<IUser> {
    const user = await this.userRepository.findUserByEmail(email);

    if (!user) throw new Error("User not exist");

    const isPasswordMatch = await this.userRepository.comparePasswords(
      password,
      user.password
    );

    if (!isPasswordMatch) throw new Error("Invalid credentials");

    return user;
  }

}
