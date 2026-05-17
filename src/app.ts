import express, { Application } from "express";

import cors from "cors";

import helmet from "helmet";

import morgan from "morgan";

import cookieParser from "cookie-parser";
import globalErrorHandler from "./middleware/globalErrorHandler";


const app: Application = express();


// parsers
app.use(express.json());


// third-party middlewares
app.use(cors());

app.use(helmet());

app.use(morgan("dev"));

app.use(cookieParser());


// test route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server running successfully",
  });
});


// not found handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});


// global error handler
app.use(globalErrorHandler);

export default app;