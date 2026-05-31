import { Router } from "express";
import authRouter from "./auth/auth.routes";
import productRouter from "./products/products.routes";
import { authMiddleware } from "../../middleware/auth.middleware";

const adminRouter = Router();

adminRouter.use("/auth", authRouter);

adminRouter.use(authMiddleware.auth);
adminRouter.use(authMiddleware.admin);



adminRouter.use("/products", productRouter);

export default adminRouter;
