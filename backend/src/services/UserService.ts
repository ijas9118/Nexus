import { IUserRepository } from "../repositories/Users/IUserRepository";

export class UserService {
  constructor(private userRepository: IUserRepository) {}
}
