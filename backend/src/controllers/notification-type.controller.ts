import type { Request, Response } from "express";

import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { INotificationTypeController } from "@/core/interfaces/controllers/i-notification-type-controller";
import type { INotificationTypeService } from "@/core/interfaces/services/i-notification-type-service";

import { TYPES } from "@/di/types";

@injectable()
export class NotificationTypeController implements INotificationTypeController {
  constructor(
    @inject(TYPES.NotificationTypeService)
    private _notificationTypeService: INotificationTypeService,
  ) {}

  createNotificationType = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { name, description, icon, iconColor, roles } = req.body;

    const notificationType = await this._notificationTypeService.createNotificationType({
      name,
      description,
      icon,
      iconColor,
      roles,
    });

    res.status(StatusCodes.CREATED).json(notificationType);
  });

  getNotificationTypes = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const notificationTypes = await this._notificationTypeService.getNotificationTypes();
    res.status(StatusCodes.OK).json(notificationTypes);
  });

  updateNotificationType = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { name, description, icon, iconColor, roles } = req.body;

    const updatedType = await this._notificationTypeService.updateNotificationType(id as string, {
      name,
      description,
      icon,
      iconColor,
      roles,
    });

    res.status(StatusCodes.OK).json(updatedType);
  });

  deleteNotificationType = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await this._notificationTypeService.deleteNotificationType(id as string);
    res.status(StatusCodes.NO_CONTENT).send();
  });

  restoreNotificationType = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this._notificationTypeService.restoreNotificationType(req.params.id as string);
    res.status(StatusCodes.NO_CONTENT).send();
  });
}
