import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { CustomRequest } from "../core/types/CustomRequest";
import { IUserController } from "../core/interfaces/controllers/IUserController";
import { IUserService } from "../core/interfaces/services/IUserService";

@injectable()
export class UserController implements IUserController {
  constructor(@inject(TYPES.UserService) private userService: IUserService) {}

  getUserJoinedSquads = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?._id as string;

      const squads = await this.userService.getUserJoinedSquads(userId);
      res.status(200).json(squads);
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };

  getUserData = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username } = req.params;
      const userData = await this.userService.getUserByUsername(username);
      res.status(200).json(userData);
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };

  updateUser = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?._id as string;
      const result = await this.userService.updateUser(userId, req.body);
      res.status(200).json(result);
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };

  updatePassword = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?._id as string;
      if (!userId) {
        res.status(401).json({ success: false, message: "Unauthorized" });
      }

      await this.userService.updatePassword(userId, req.body);

      res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (error: any) {
      console.error("Error updating password:", error);

      if (error.message === "User not found") {
        res.status(404).json({ success: false, message: "User not found" });
        return;
      }

      if (error.message === "Current password is incorrect") {
        res
          .status(400)
          .json({ success: false, message: "Current password is incorrect" });
        return;
      }

      if (error.message === "New password and confirm password do not match") {
        res.status(400).json({ success: false, message: "Passwords do not match" });
        return;
      }

      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
}
