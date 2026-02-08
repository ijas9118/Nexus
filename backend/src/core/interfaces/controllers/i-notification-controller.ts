import type { RequestHandler } from 'express';

export interface INotificationController {
  getUserNotifications: RequestHandler;
  markAsRead: RequestHandler;
  markAllAsRead: RequestHandler;
  deleteNotification: RequestHandler;
  deleteManyNotifications: RequestHandler;
}
