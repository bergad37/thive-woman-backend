import { Router } from "express";
import authRoutes from "./auth.routes";
import cartRoutes from "./cart.routes";
import dashboardRoutes from "./dashboard.routes";
import productRoutes from "./product.routes";
import stockRoutes from "./stock.routes";
import transactionRoutes from "./transaction.routes";
import userRoutes from "./user.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/carts", cartRoutes);
router.use("/transactions", transactionRoutes);
router.use("/stock", stockRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
