import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async.middleware";
import { DashboardService } from "../services/dashboard.service";

const dashboardService = new DashboardService();

export const getOverview = asyncHandler(async (_req: Request, res: Response) => {
  const overview = await dashboardService.getOverview();
  res.status(200).json({
    success: true,
    data: overview
  });
});
