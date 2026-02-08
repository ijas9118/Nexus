import type { Document } from "mongoose";

import mongoose, { Schema } from "mongoose";

interface INotification extends Document<string> {
  notificationTypeId: string;
  recipientId: string;
  heading: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    notificationTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NotificationType",
      required: true,
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    heading: {
      type: String,
      required: true,
      trim: true,
      minlength: [5, "Heading must be at least 5 characters"],
      maxlength: [100, "Heading must not exceed 100 characters"],
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: [5, "Message must be at least 5 characters"],
      maxlength: [500, "Message must not exceed 500 characters"],
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: false },
  },
);

NotificationSchema.index({ recipientId: 1, createdAt: -1 });
NotificationSchema.index({ notificationTypeId: 1 });

const NotificationModel = mongoose.model<INotification>("Notification", NotificationSchema);
export { INotification, NotificationModel };
