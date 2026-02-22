import { injectable } from "inversify";
import { Types } from "mongoose";

import type { IAdminRepository } from "@/core/interfaces/repositories/i-admin-repository";
import type { IAdmin } from "@/models/admin/admin.model";

import { BaseRepository } from "@/core/abstracts/base.repository";
import Admin from "@/models/admin/admin.model";

@injectable()
export class AdminRepository extends BaseRepository<IAdmin> implements IAdminRepository {
  constructor() {
    super(Admin);
  }

  async findByEmail(email: string): Promise<IAdmin | null> {
    return this._model.findOne({ email });
  }

  async create(admin: IAdmin): Promise<IAdmin> {
    return this._model.create(admin);
  }

  async updateUser(id: string, admin: Partial<IAdmin>): Promise<IAdmin | null> {
    const idObj = new Types.ObjectId(id);
    return this.update(idObj, admin);
  }

  // async delete(id: string): Promise<IAdmin | null> {
  //   return this._model.findByIdAndDelete(id);
  // }
}
