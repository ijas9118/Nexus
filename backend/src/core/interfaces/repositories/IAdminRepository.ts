import { IAdmin } from "../../../models/admin.model";

export interface IAdminRepository {
  findByEmail(email: string): Promise<IAdmin | null>;
  create(admin: IAdmin): Promise<IAdmin>;
  update(id: string, admin: Partial<IAdmin>): Promise<IAdmin | null>;
  delete(id: string): Promise<IAdmin | null>;
}
