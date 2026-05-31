import { Router } from "express";
import authRouter from "./auth/auth.routes";

const adminRouter = Router();

adminRouter.use("/auth", authRouter);

export default adminRouter;
