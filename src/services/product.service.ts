import { AppDataSource } from "../config/data-source";
import { Product, ProductStatus } from "../entities/product.entity";
import { AppError } from "../utils/app-error";

export class ProductService {
  private productRepository = AppDataSource.getRepository(Product);

  async createProduct(payload: Partial<Product>) {
    const product = this.productRepository.create(payload);
    product.status = this.resolveStatus(product.stockQuantity || 0, product.status);
    return this.productRepository.save(product);
  }

  async getProducts() {
    return this.productRepository.find({
      order: { createdAt: "DESC" }
    });
  }

  async getProductById(id: string) {
    const product = await this.productRepository.findOneBy({ id });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    return product;
  }

  async updateProduct(id: string, payload: Partial<Product>) {
    const product = await this.getProductById(id);
    Object.assign(product, payload);
    product.status = this.resolveStatus(product.stockQuantity, product.status);
    return this.productRepository.save(product);
  }

  async deleteProduct(id: string) {
    const product = await this.getProductById(id);
    await this.productRepository.remove(product);
    return { message: "Product deleted successfully" };
  }

  async getProductSummary() {
    const products = await this.getProducts();
    const totalProducts = products.length;
    const activeProducts = products.filter((product) => product.isActive).length;
    const totalStock = products.reduce((sum, product) => sum + Number(product.stockQuantity), 0);
    const outOfStock = products.filter((product) => product.stockQuantity === 0).length;

    return {
      totalProducts,
      activeProducts,
      totalStock,
      outOfStock
    };
  }

  private resolveStatus(stockQuantity: number, currentStatus?: ProductStatus) {
    if (stockQuantity <= 0) {
      return ProductStatus.OUT_OF_STOCK;
    }

    return currentStatus === ProductStatus.INACTIVE ? ProductStatus.INACTIVE : ProductStatus.ACTIVE;
  }
}
