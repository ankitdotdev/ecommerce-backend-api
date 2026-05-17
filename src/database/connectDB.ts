import mongoose from "mongoose";

import { config } from "../config";

export async function connectDB() {
  try {
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connection established");
    });

    mongoose.connection.on("error", (err) => {
      console.log("MongoDB connection error");

      console.log(err);
    });

    await mongoose.connect(config.mongoUri);
  } catch (error) {
    console.log("Database connection failed");

    console.log(error);

    process.exit(1);
  }
}