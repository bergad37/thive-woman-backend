import { Router } from "express";
import { getOverview } from "../controllers/dashboard.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.use(protect);
router.get("/overview", getOverview);

export default router;
