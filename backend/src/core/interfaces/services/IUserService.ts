import { IUser } from "../../../models/user.model";
import { BaseService } from "../../abstracts/base.service";

export interface IUserService {
  findByEmail(email: string): Promise<IUser | null>;
}
