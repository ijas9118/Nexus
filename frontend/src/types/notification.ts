export interface NotificationTypeData {
  _id: string;
  name: string;
  description: string;
  icon: string;
  iconColor: string;
  roles: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationType {
  _id: string;
  name: string;
  icon: string;
  iconColor: string;
}

export interface INotification {
  _id: string;
  notificationTypeId: NotificationType;
  recipientId: string;
  heading: string;
  message: string;
  read: boolean;
  createdAt: string;
}
