import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async.middleware";
import { TransactionStatus } from "../entities/transaction.entity";
import { TransactionService } from "../services/transaction.service";

const transactionService = new TransactionService();

export const createTransaction = asyncHandler(async (req: Request, res: Response) => {
  const transaction = await transactionService.createTransactionFromCart(
    req.user!.id,
    req.body.paymentMethod
  );

  res.status(201).json({
    success: true,
    data: transaction
  });
});

export const getTransactions = asyncHandler(async (_req: Request, res: Response) => {
  const transactions = await transactionService.getTransactions();
  res.status(200).json({
    success: true,
    data: transactions
  });
});

export const getTransactionById = asyncHandler(async (req: Request, res: Response) => {
  const transaction = await transactionService.getTransactionById(String(req.params.id));
  res.status(200).json({
    success: true,
    data: transaction
  });
});

export const updateTransactionStatus = asyncHandler(async (req: Request, res: Response) => {
  const transaction = await transactionService.updateTransactionStatus(
    String(req.params.id),
    req.body.status as TransactionStatus
  );

  res.status(200).json({
    success: true,
    data: transaction
  });
});

export const getTransactionSummary = asyncHandler(async (_req: Request, res: Response) => {
  const summary = await transactionService.getTransactionSummary();
  res.status(200).json({
    success: true,
    data: summary
  });
});
