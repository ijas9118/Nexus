import asyncHandler from 'express-async-handler';
import { INotificationTypeController } from '@/core/interfaces/controllers/INotificationTypeController';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { INotificationTypeService } from '@/core/interfaces/services/INotificationTypeService';
import { TYPES } from '@/di/types';

@injectable()
export class NotificationTypeController implements INotificationTypeController {
  constructor(
    @inject(TYPES.NotificationTypeService)
    private _notificationTypeService: INotificationTypeService
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

    const updatedType = await this._notificationTypeService.updateNotificationType(id, {
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
    await this._notificationTypeService.deleteNotificationType(id);
    res.status(StatusCodes.NO_CONTENT).send();
  });

  restoreNotificationType = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this._notificationTypeService.restoreNotificationType(req.params.id);
    res.status(StatusCodes.NO_CONTENT).send();
  });
}
