import mongoose from "mongoose";

// Simple, direct MongoDB connection (class-style, no global cache).
// Call it at the start of every API route before touching the database.
const connectDB = async (): Promise<void> => {
    const uri = process.env.MONGODB_URI;

    // 1) Make sure the environment variable exists.
    if (!uri) {
        throw new Error("Missing environment variable MONGODB_URI");
    }

    try {
        // 2) Connect. Mongoose reuses the connection if it is already open.
        await mongoose.connect(uri);
        console.log("DB Online");
    } catch (error) {
        // 3) Strict typing in catch: no `any`.
        const message = error instanceof Error ? error.message : String(error);
        // Re-throw so the route can respond 500 instead of failing silently.
        throw new Error(`Failed to connect to MongoDB: ${message}`);
    }
};

export default connectDB;
