import { Router } from "express";
import {
  createTransaction,
  getTransactionById,
  getTransactions,
  getTransactionSummary,
  updateTransactionStatus
} from "../controllers/transaction.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.use(protect);
router.get("/summary", getTransactionSummary);
router.route("/").get(getTransactions).post(createTransaction);
router.route("/:id").get(getTransactionById).patch(updateTransactionStatus);

export default router;
