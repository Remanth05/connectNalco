import { RequestHandler } from "express";
import mongoose from "mongoose";
import { Notification } from "../models/Notification";

const isMongoConnected = () => mongoose.connection.readyState === 1;

export const getNotifications: RequestHandler = async (req, res) => {
  const { employeeId } = req.params;
  if (!isMongoConnected()) {
    return res.status(503).json({ success: false, error: "MongoDB is not connected" });
  }

  const notifications = await Notification.find({ employeeId })
    .sort({ timestamp: -1 })
    .limit(20)
    .lean();
  return res.json({ success: true, data: notifications });
};

export const markNotificationRead: RequestHandler = async (req, res) => {
  const { employeeId, notificationId } = req.params;
  if (!isMongoConnected()) {
    return res.status(503).json({ success: false, error: "MongoDB is not connected" });
  }

  const notification = await Notification.findOneAndUpdate(
    { employeeId, notificationId },
    { read: true },
    { new: true },
  ).lean();
  if (!notification) {
    return res.status(404).json({ success: false, error: "Notification not found" });
  }
  return res.json({ success: true, data: notification });
};

export const markAllNotificationsRead: RequestHandler = async (req, res) => {
  const { employeeId } = req.params;
  if (!isMongoConnected()) {
    return res.status(503).json({ success: false, error: "MongoDB is not connected" });
  }

  await Notification.updateMany({ employeeId, read: false }, { read: true });
  return res.json({ success: true });
};

export const deleteNotification: RequestHandler = async (req, res) => {
  const { employeeId, notificationId } = req.params;
  if (!isMongoConnected()) {
    return res.status(503).json({ success: false, error: "MongoDB is not connected" });
  }

  await Notification.deleteOne({ employeeId, notificationId });
  return res.json({ success: true });
};
