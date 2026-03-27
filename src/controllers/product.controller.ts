import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async.middleware";
import { ProductService } from "../services/product.service";

const productService = new ProductService();

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.createProduct(req.body);
  res.status(201).json({
    success: true,
    data: product
  });
});

export const getProducts = asyncHandler(async (_req: Request, res: Response) => {
  const products = await productService.getProducts();
  res.status(200).json({
    success: true,
    data: products
  });
});

export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.getProductById(String(req.params.id));
  res.status(200).json({
    success: true,
    data: product
  });
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.updateProduct(String(req.params.id), req.body);
  res.status(200).json({
    success: true,
    data: product
  });
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const result = await productService.deleteProduct(String(req.params.id));
  res.status(200).json({
    success: true,
    ...result
  });
});
