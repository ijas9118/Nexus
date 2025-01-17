import { injectable, inject } from "inversify";
import { TYPES } from "../di/types";
import { IUserRepository } from "../core/interfaces/repositories/IUserRepository";
import { IUserService } from "../core/interfaces/services/IUserService";
import { IUser } from "../models/user.model";
import { BaseService } from "../core/abstracts/base.service";

@injectable()
export class UserService extends BaseService<IUser> implements IUserService {
  constructor(@inject(TYPES.UserRepository) private userRepository: IUserRepository) {
    super(userRepository);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.userRepository.findByEmail(email);
  }
}
