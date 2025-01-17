import { injectable } from "inversify";
import { IUser } from "../models/user.model";
import User from "../models/user.model";
import { BaseRepository } from "../core/abstracts/base.repository";
import { IUserRepository } from "../core/interfaces/repositories/IUserRepository";

@injectable()
export class UserRepository extends BaseRepository<IUser> implements IUserRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.model.findOne({ email });
  }
}
