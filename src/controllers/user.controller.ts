import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async.middleware";
import { UserService } from "../services/user.service";

const userService = new UserService();

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  res.status(201).json({
    success: true,
    data: user
  });
});

export const getUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await userService.getUsers();
  res.status(200).json({
    success: true,
    data: users
  });
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.getUserById(String(req.params.id));
  res.status(200).json({
    success: true,
    data: user
  });
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.updateUser(String(req.params.id), req.body);
  res.status(200).json({
    success: true,
    data: user
  });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.deleteUser(String(req.params.id));
  res.status(200).json({
    success: true,
    ...result
  });
});
