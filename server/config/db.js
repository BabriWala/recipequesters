// src/config/db.ts
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGODBURI) {
      throw new Error("MONGODBURI is not defined");
    }
    await mongoose.connect(process.env.MONGODBURI);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
