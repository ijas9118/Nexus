import type { Request, Response } from "express";

import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { INotificationController } from "@/core/interfaces/controllers/i-notification-controller";
import type { INotificationService } from "@/core/interfaces/services/i-notification-service";

import { TYPES } from "@/di/types";
import CustomError from "@/utils/custom-error";

@injectable()
export class NotificationController implements INotificationController {
  constructor(
    @inject(TYPES.NotificationService)
    private _notificationService: INotificationService,
  ) {}

  getUserNotifications = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
    const { read } = req.query; // Optional: 'true' or 'false'
    const readStatus = read !== undefined ? read === "true" : undefined;

    const notifications = await this._notificationService.getUserNotifications(userId, readStatus);
    res.status(StatusCodes.OK).json(notifications);
  });

  markAsRead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const notification = await this._notificationService.markAsRead(id);
    if (!notification) {
      throw new CustomError("Notification not found");
    }
    res.status(StatusCodes.OK).json(notification);
  });

  markAllAsRead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
    const modifiedCount = await this._notificationService.markAllAsRead(userId);
    res.status(StatusCodes.OK).json({ modifiedCount });
  });

  deleteNotification = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const notification = await this._notificationService.delete(id);
    if (!notification) {
      throw new CustomError("Notification not found");
    }
    res.status(StatusCodes.OK).json({ message: "Notification deleted" });
  });

  deleteManyNotifications = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new CustomError("Provide an array of notification IDs");
    }

    const deletedCount = await this._notificationService.deleteManyByIds(ids);
    res.status(StatusCodes.OK).json({ deletedCount });
  });
}
