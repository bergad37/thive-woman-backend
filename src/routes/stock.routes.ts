import { Router } from "express";
import { getStockSummary } from "../controllers/stock.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.use(protect);
router.get("/summary", getStockSummary);

export default router;
