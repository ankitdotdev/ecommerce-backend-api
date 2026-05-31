import { Router } from "express";
import authRouter from "./auth/auth.routes";
import productRouter from "./products/products.routes";

const adminRouter = Router();

adminRouter.use("/auth", authRouter);
adminRouter.use("/products", productRouter);

export default adminRouter;
