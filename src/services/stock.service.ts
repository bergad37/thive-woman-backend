import { AppDataSource } from "../config/data-source";
import { Product } from "../entities/product.entity";

export class StockService {
  private productRepository = AppDataSource.getRepository(Product);

  async getStockSummary() {
    const products = await this.productRepository.find({
      order: { createdAt: "DESC" }
    });

    const totalStock = products.reduce((sum, product) => sum + product.stockQuantity, 0);
    const lowStockItems = products.filter(
      (product) => product.stockQuantity > 0 && product.stockQuantity <= 10
    ).length;
    const outOfStock = products.filter((product) => product.stockQuantity === 0).length;

    return {
      metrics: {
        totalStock,
        lowStockItems,
        outOfStock
      },
      items: products.map((product) => ({
        id: product.id,
        name: product.name,
        subtitle: product.subtitle,
        category: product.category,
        inStock: product.stockQuantity,
        distributed: product.distributedQuantity,
        status: product.stockQuantity > 0 ? "In Stock" : "Out of Stock"
      }))
    };
  }
}
