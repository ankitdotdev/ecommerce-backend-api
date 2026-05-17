import app from "./app";

import { config } from "./config";

import { connectDB } from "./database/connectDB";

async function startServer() {
  try {
    await connectDB();

    app.listen(config.port, () => {
      console.log(
        `Server running on port ${config.port}`
      );
    });
  } catch (error) {
    console.log("Server failed to start");

    console.log(error);

    process.exit(1);
  }
}

startServer();