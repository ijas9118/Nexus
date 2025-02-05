import { IAdmin } from "../../../models/admin.model";

export interface IAdminRepository {
  findByEmail(email: string): Promise<IAdmin | null>;
  create(admin: IAdmin): Promise<IAdmin>;
  updateUser(id: string, admin: Partial<IAdmin>): Promise<IAdmin | null>;
}
