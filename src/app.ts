import express, { Application } from "express";

import cors from "cors";

import helmet from "helmet";

import morgan from "morgan";

import cookieParser from "cookie-parser";

import swaggerUi from "swagger-ui-express";

import globalErrorHandler from "./middleware/globalErrorHandler";

import authRouter from "./modules/auth/auth.routes";

import { swaggerSpec } from "./config/swagger";

import { config } from "./config";
import adminRouter from "./modules/admin/admin.routes";
import productRouter from "./modules/products/products.route";
import uploadRouter from "./modules/uploads/uploads.routes";

const app: Application = express();

// parsers
app.use(express.json());

// third-party middlewares
app.use(
  cors({
    origin: "http://localhost:3000", // Replace this with your frontend url

    credentials: true, // Required configuration to use cookies
  }),
);

app.use(helmet());

app.use(morgan("dev"));

app.use(cookieParser());

// swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// test route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server running successfully",
  });
});

// auth routes
app.use(`${config.apiPrefix}/auth`, authRouter);
app.use(`${config.apiPrefix}/admin`, adminRouter);
app.use(`${config.apiPrefix}/products`, productRouter);
app.use(`${config.apiPrefix}/upload`, uploadRouter);

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
