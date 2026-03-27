import { ProductService } from "./product.service";
import { StockService } from "./stock.service";
import { TransactionService } from "./transaction.service";
import { UserService } from "./user.service";

export class DashboardService {
  private productService = new ProductService();
  private transactionService = new TransactionService();
  private stockService = new StockService();
  private userService = new UserService();

  async getOverview() {
    const productSummary = await this.productService.getProductSummary();
    const transactionSummary = await this.transactionService.getTransactionSummary();
    const stockSummary = await this.stockService.getStockSummary();
    const users = await this.userService.getUsers();

    return {
      totalProducts: productSummary.totalProducts,
      activeProducts: productSummary.activeProducts,
      totalUsers: users.length,
      padsDistributed: stockSummary.items.reduce((sum, item) => sum + item.distributed, 0),
      totalStock: productSummary.totalStock,
      revenue: transactionSummary.completedRevenue,
      outOfStock: productSummary.outOfStock,
      recentProducts: (await this.productService.getProducts()).slice(0, 5)
    };
  }
}
