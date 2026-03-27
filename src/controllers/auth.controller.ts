import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { asyncHandler } from "../middlewares/async.middleware";
import { generateToken } from "../utils/generate-token";

const authService = new AuthService();

const sanitizeUser = <T extends { password?: string }>(user: T) => {
  const { password, ...safeUser } = user;
  return safeUser;
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.register(req.body);
  const token = generateToken(user);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      user: sanitizeUser(user),
      token
    }
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await authService.login(email, password);
  const token = generateToken(user);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: sanitizeUser(user),
      token
    }
  });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: req.user
  });
});
