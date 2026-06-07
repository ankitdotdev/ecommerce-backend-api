import { Router } from "express";
import authRouter from "./auth/auth.routes";
import productRouter from "./products/products.routes";
import { authMiddleware } from "../../middleware/auth.middleware";
import orderAdminRouter from "./orders/orders.routes";
import userRouter from "./users/users.routes";
import reviewRouter from "./reviews/reviews.routes";

const adminRouter = Router();

adminRouter.use("/auth", authRouter);

adminRouter.use(authMiddleware.auth);
adminRouter.use(authMiddleware.admin);

adminRouter.use("/products", productRouter);
adminRouter.use("/orders", orderAdminRouter);
adminRouter.use("/users", userRouter);
adminRouter.use("/reviews", reviewRouter);

export default adminRouter;
