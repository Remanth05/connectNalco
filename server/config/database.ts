import "dotenv/config";
import mongoose from "mongoose";

export const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/connectNalco";
  const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "connectNalco";

  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      dbName: MONGODB_DB_NAME,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    console.log("🔄 Falling back to development mode without MongoDB");
    console.log("✨ Using demo credentials for authentication");
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
    return null;
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("MongoDB Disconnected");
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error);
  }
};
