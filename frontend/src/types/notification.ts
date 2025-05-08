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

export interface INotification {
  _id: string;
  notificationTypeId: string;
  recipientId: string;
  heading: string;
  message: string;
  read: boolean;
  createdAt: string;
}
