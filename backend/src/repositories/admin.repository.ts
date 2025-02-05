import { injectable } from "inversify";
import { BaseRepository } from "../core/abstracts/base.repository";
import { IAdminRepository } from "../core/interfaces/repositories/IAdminRepository";
import { IAdmin } from "../models/admin.model";
import Admin from "../models/admin.model";
import { Types } from "mongoose";

@injectable()
export class AdminRepository extends BaseRepository<IAdmin> implements IAdminRepository {
  constructor() {
    super(Admin);
  }

  async findByEmail(email: string): Promise<IAdmin | null> {
    return this.model.findOne({ email });
  }

  async create(admin: IAdmin): Promise<IAdmin> {
    return this.model.create(admin);
  }

  async updateUser(id: string, admin: Partial<IAdmin>): Promise<IAdmin | null> {
    const idObj = new Types.ObjectId(id);
    return this.update(idObj, admin);
  }

  // async delete(id: string): Promise<IAdmin | null> {
  //   return this.model.findByIdAndDelete(id);
  // }
}
