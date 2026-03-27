import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async.middleware";
import { CartService } from "../services/cart.service";

const cartService = new CartService();

export const getMyCart = asyncHandler(async (req: Request, res: Response) => {
  const cart = await cartService.getOrCreateActiveCart(req.user!.id);
  res.status(200).json({
    success: true,
    data: cart
  });
});

export const addToCart = asyncHandler(async (req: Request, res: Response) => {
  const cart = await cartService.addItem(req.user!.id, req.body.productId, Number(req.body.quantity));
  res.status(200).json({
    success: true,
    data: cart
  });
});

export const updateCartItem = asyncHandler(async (req: Request, res: Response) => {
  const cart = await cartService.updateItemQuantity(
    req.user!.id,
    String(req.params.itemId),
    Number(req.body.quantity)
  );
  res.status(200).json({
    success: true,
    data: cart
  });
});

export const removeCartItem = asyncHandler(async (req: Request, res: Response) => {
  const cart = await cartService.removeItem(req.user!.id, String(req.params.itemId));
  res.status(200).json({
    success: true,
    data: cart
  });
});

export const clearCart = asyncHandler(async (req: Request, res: Response) => {
  const cart = await cartService.clearCart(req.user!.id);
  res.status(200).json({
    success: true,
    data: cart
  });
});
