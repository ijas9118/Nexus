import type { Document } from "mongoose";

import mongoose, { Schema } from "mongoose";

interface INotificationType extends Document {
  _id: mongoose.Types.ObjectId | string;
  name: string;
  description: string;
  icon: string;
  iconColor: string;
  roles: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationTypeSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true, // E.g., "bell", "heart", or URL to custom icon
    },
    iconColor: {
      type: String,
      required: true, // E.g., "#FF0000" (hex code)
      match: /^#([0-9A-F]{3}){1,2}$/i, // Validates hex color
    },
    roles: {
      type: [String],
      required: true,
      enum: ["mentor", "user", "premium", "admin"],
      validate: {
        validator: (roles: string[]) => roles.length > 0,
        message: "At least one role is required",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

NotificationTypeSchema.index({ roles: 1 });

const NotificationTypeModel = mongoose.model<INotificationType>(
  "NotificationType",
  NotificationTypeSchema,
);
export { INotificationType, NotificationTypeModel };
