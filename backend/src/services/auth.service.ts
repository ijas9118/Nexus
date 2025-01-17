import { injectable, inject } from "inversify";
import { TYPES } from "../di/types";
import { IUserRepository } from "../core/interfaces/repositories/IUserRepository";
import { LoginDto } from "../dtos/requests/auth/login.dto";
import { RegisterDto } from "../dtos/requests/auth/register.dto";
import { IUser } from "../models/user.model";
import { compare, hash } from "bcrypt";

@injectable()
export class AuthService {
  constructor(@inject(TYPES.UserRepository) private userRepository: IUserRepository) {}

  async register(registerDto: RegisterDto): Promise<IUser> {
    const { name, email, password } = registerDto;
    const hashedPassword = await hash(password, 10);
    return this.userRepository.create({ name, email, password: hashedPassword });
  }

  async login(loginDto: LoginDto): Promise<IUser | null> {
    const { email, password } = loginDto;
    const user = await this.userRepository.findByEmail(email);
    if (!user) return null;

    const isPasswordValid = await compare(password, user.password);
    return isPasswordValid ? user : null;
  }
}
