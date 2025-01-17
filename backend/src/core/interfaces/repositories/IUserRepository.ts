import { IUser } from "../../../models/user.model";
import { BaseRepository } from "../../abstracts/base.repository";

export interface IUserRepository extends BaseRepository<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
}
