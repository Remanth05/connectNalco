import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/nalco_connect";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    console.log("🔄 Running in development mode without MongoDB");
    console.log("📝 To enable MongoDB:");
    console.log(
      "   1. Install MongoDB: https://www.mongodb.com/docs/manual/installation/",
    );
    console.log(
      "   2. Start MongoDB service: sudo systemctl start mongod (Linux) or brew services start mongodb-community (macOS)",
    );
    console.log("   3. Or use MongoDB Atlas: https://www.mongodb.com/atlas");
    console.log("   4. Run: npm run seed-db to populate with initial data");

    // Don't exit in development, just warn
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
