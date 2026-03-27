import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async.middleware";
import { StockService } from "../services/stock.service";

const stockService = new StockService();

export const getStockSummary = asyncHandler(async (_req: Request, res: Response) => {
  const stock = await stockService.getStockSummary();
  res.status(200).json({
    success: true,
    data: stock
  });
});
