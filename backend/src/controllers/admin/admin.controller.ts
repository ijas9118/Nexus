import { Request, Response } from 'express';
import { IAdminController } from '../../core/interfaces/controllers/admin/IAdminController';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../di/types';
import { IUserService } from '../../core/interfaces/services/IUserService';
import { StatusCodes } from 'http-status-codes';
import CustomError from '../../utils/CustomError';

@injectable()
export class AdminController implements IAdminController {
  constructor(@inject(TYPES.UserService) private userService: IUserService) {}

  async getUsers(req: Request, res: Response): Promise<void> {
    const users = await this.userService.getUsers();
    res.status(StatusCodes.OK).json(users);
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    const user = await this.userService.getUserById(req.params.id);
    if (!user) {
      throw new CustomError('User not found', StatusCodes.NOT_FOUND);
    }
    res.status(StatusCodes.OK).json(user);
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    const updatedUser = await this.userService.updateUser(req.params.id, req.body);
    if (!updatedUser) {
      throw new CustomError('User not found', StatusCodes.NOT_FOUND);
    }
    res.status(StatusCodes.OK).json(updatedUser);
  }
}
