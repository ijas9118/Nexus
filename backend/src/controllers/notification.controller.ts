import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import { TYPES } from '@/di/types';
import { INotificationService } from '@/core/interfaces/services/INotificationService';
import CustomError from '@/utils/CustomError';
import { INotificationController } from '@/core/interfaces/controllers/INotificationController';

@injectable()
export class NotificationController implements INotificationController {
  constructor(
    @inject(TYPES.NotificationService)
    private notificationService: INotificationService
  ) {}

  getUserNotifications = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
    const { read } = req.query; // Optional: 'true' or 'false'
    const readStatus = read !== undefined ? read === 'true' : undefined;

    const notifications = await this.notificationService.getUserNotifications(userId, readStatus);
    res.status(StatusCodes.OK).json(notifications);
  });

  markAsRead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const notification = await this.notificationService.markAsRead(id);
    if (!notification) {
      throw new CustomError('Notification not found');
    }
    res.status(StatusCodes.OK).json(notification);
  });

  markAllAsRead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
    const modifiedCount = await this.notificationService.markAllAsRead(userId);
    res.status(StatusCodes.OK).json({ modifiedCount });
  });

  deleteNotification = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const notification = await this.notificationService.delete(id);
    if (!notification) {
      throw new CustomError('Notification not found');
    }
    res.status(StatusCodes.OK).json({ message: 'Notification deleted' });
  });

  deleteManyNotifications = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new CustomError('Provide an array of notification IDs');
    }

    const deletedCount = await this.notificationService.deleteManyByIds(ids);
    res.status(StatusCodes.OK).json({ deletedCount });
  });
}
