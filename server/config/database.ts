import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/nalco_connect";

export const connectDB = async () => {
  try {
    // Skip MongoDB connection in development if MONGODB_URI is default
    if (MONGODB_URI === "mongodb://localhost:27017/nalco_connect" && process.env.NODE_ENV !== "production") {
      console.log("🔄 Running in development mode without MongoDB");
      console.log("✨ Using demo credentials for authentication");
      console.log("📝 Demo login credentials:");
      console.log("   • Employee: EMP001 / emp123");
      console.log("   • Authority: AUTH001 / auth123");
      console.log("   • Admin: ADMIN001 / admin123");
      console.log("");
      console.log("💡 To enable MongoDB:");
      console.log("   1. Install MongoDB locally or use MongoDB Atlas");
      console.log("   2. Update MONGODB_URI in .env file");
      console.log("   3. Run: npm run seed-db to populate initial data");
      return null;
    }

    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    console.log("🔄 Falling back to development mode without MongoDB");
    console.log("✨ Using demo credentials for authentication");
    console.log("📝 Demo login credentials:");
    console.log("   • Employee: EMP001 / emp123");
    console.log("   • Authority: AUTH001 / auth123");
    console.log("   • Admin: ADMIN001 / admin123");

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
