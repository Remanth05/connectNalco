import mongoose from "mongoose";
import type { Response } from "express";

export const isMongoConnected = () => mongoose.connection.readyState === 1;

export const requireMongo = (res: Response) => {
  if (!isMongoConnected()) {
    res.status(503).json({ success: false, error: "MongoDB is not connected" });
    return false;
  }
  return true;
};

export const withoutMongoFields = (value: any) => {
  const { _id, __v, ...result } = value;
  return result;
};

export const withoutMongoFieldsMany = (values: any[]) => values.map(withoutMongoFields);
