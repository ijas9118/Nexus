import type { RequestHandler } from 'express';

export interface INotificationTypeController {
  createNotificationType: RequestHandler;
  getNotificationTypes: RequestHandler;
  updateNotificationType: RequestHandler;
  deleteNotificationType: RequestHandler;
  restoreNotificationType: RequestHandler;
}
