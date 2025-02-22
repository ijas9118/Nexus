import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { CustomRequest } from "../core/types/CustomRequest";
import { IUserController } from "../core/interfaces/controllers/IUserController";
import { UserService } from "../services/user.service";

@injectable()
export class UserController implements IUserController {
  constructor(@inject(TYPES.UserService) private userService: UserService) {}

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
      console.log(req.body.socials.github);
      const result = await this.userService.updateUser(userId, req.body);
      res.status(200).json({ success: true });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };
}
