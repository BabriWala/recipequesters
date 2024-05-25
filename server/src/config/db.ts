// src/config/db.ts
import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    if (!process.env.MONGODBURI) {
      throw new Error("MONGODBURI is not defined");
    }
    await mongoose.connect(process.env.MONGODBURI);
    console.log("MongoDB connected");
  } catch (err: any) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;
