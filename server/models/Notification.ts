import mongoose, { Document, Schema } from "mongoose";

export interface INotification extends Document {
  notificationId: string;
  employeeId: string;
  title: string;
  message: string;
  type: "success" | "warning" | "info" | "error";
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

const notificationSchema = new Schema<INotification>(
  {
    notificationId: { type: String, required: true, unique: true },
    employeeId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["success", "warning", "info", "error"],
      required: true,
    },
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
    actionUrl: { type: String },
  },
  { timestamps: true },
);

notificationSchema.index({ employeeId: 1, timestamp: -1 });

export const Notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema,
);
