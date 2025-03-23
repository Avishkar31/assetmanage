import mongoose from "mongoose";

const MONGODB_URI =
  // "mongodb+srv://admin:aviavi12345@cluster0.0bvrulr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  "mongodb://192.168.0.103:27017/";
// process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;

export const connectDb = async () => {
  try {
    await dbConnect();
    console.log("Connected to MongoDB!");
    return true;
  } catch (e) {
    console.error("Failed to connect to MongoDB!", e);
    return false;
  }
};
