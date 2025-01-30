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

  async update(id: string, admin: Partial<IAdmin>): Promise<IAdmin | null> {
    return this.model.findByIdAndUpdate(id, admin, { new: true });
  }

  async delete(id: string): Promise<IAdmin | null> {
    return this.model.findByIdAndDelete(id);
  }
}
