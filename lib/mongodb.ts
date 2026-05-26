import mongoose from "mongoose";

// MongoDB connection URI from environment variable
const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

// Extend the global type to include the mongoose cache
interface MongooseCache {
  conn: mongoose.Mongoose | null;
  promise: Promise<mongoose.Mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

// Use a cached connection to avoid creating multiple connections during hot reloads
const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = cached;

async function connectDB(): Promise<mongoose.Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongooseInstance) => mongooseInstance);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
