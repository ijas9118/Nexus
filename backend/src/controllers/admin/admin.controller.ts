import { Request, Response } from "express";
import { IAdminController } from "../../core/interfaces/controllers/admin/IAdminController";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IUserService } from "../../core/interfaces/services/IUserService";

@injectable()
export class AdminController implements IAdminController {
  constructor(@inject(TYPES.UserService) private userService: IUserService) {}

  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.getUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.userService.getUserById(req.params.id);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user" });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const updatedUser = await this.userService.updateUser(req.params.id, req.body);
      if (!updatedUser) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Error updating user" });
    }
  }
}
