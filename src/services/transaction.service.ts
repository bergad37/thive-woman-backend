import { AppDataSource } from "../config/data-source";
import { Cart, CartStatus } from "../entities/cart.entity";
import { Product, ProductStatus } from "../entities/product.entity";
import { Transaction, TransactionStatus } from "../entities/transaction.entity";
import { TransactionItem } from "../entities/transaction-item.entity";
import { User } from "../entities/user.entity";
import { AppError } from "../utils/app-error";

export class TransactionService {
  private transactionRepository = AppDataSource.getRepository(Transaction);
  private transactionItemRepository = AppDataSource.getRepository(TransactionItem);
  private userRepository = AppDataSource.getRepository(User);
  private cartRepository = AppDataSource.getRepository(Cart);
  private productRepository = AppDataSource.getRepository(Product);

  async createTransactionFromCart(userId: string, paymentMethod: Transaction["paymentMethod"]) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const cart = await this.cartRepository.findOne({
      where: {
        user: { id: userId },
        status: CartStatus.ACTIVE
      },
      relations: ["items", "items.product", "user"]
    });

    if (!cart || cart.items.length === 0) {
      throw new AppError("Cart is empty", 400);
    }

    const code = await this.generateTransactionCode();
    const totalAmount = cart.items.reduce(
      (sum, item) => sum + Number(item.unitPrice) * item.quantity,
      0
    );

    const transaction = this.transactionRepository.create({
      code,
      customer: user,
      paymentMethod,
      totalAmount,
      status: TransactionStatus.COMPLETED,
      items: []
    });

    const savedTransaction = await this.transactionRepository.save(transaction);

    for (const item of cart.items) {
      if (!item.product) {
        throw new AppError("Product not found for transaction item", 404);
      }

      if (item.product.stockQuantity < item.quantity) {
        throw new AppError(`Insufficient stock for ${item.product.name}`);
      }

      item.product.stockQuantity -= item.quantity;
      item.product.distributedQuantity += item.quantity;
      item.product.status =
        item.product.stockQuantity <= 0 ? ProductStatus.OUT_OF_STOCK : ProductStatus.ACTIVE;

      await this.productRepository.save(item.product);

      const transactionItem = this.transactionItemRepository.create({
        transaction: savedTransaction,
        product: item.product,
        quantity: item.quantity,
        unitPrice: item.unitPrice
      });

      await this.transactionItemRepository.save(transactionItem);
    }

    cart.status = CartStatus.CHECKED_OUT;
    await this.cartRepository.save(cart);

    return this.getTransactionById(savedTransaction.id);
  }

  async getTransactions() {
    return this.transactionRepository.find({
      order: { createdAt: "DESC" }
    });
  }

  async getTransactionById(id: string) {
    const transaction = await this.transactionRepository.findOne({
      where: { id }
    });

    if (!transaction) {
      throw new AppError("Transaction not found", 404);
    }

    return transaction;
  }

  async updateTransactionStatus(id: string, status: TransactionStatus) {
    const transaction = await this.getTransactionById(id);
    transaction.status = status;
    return this.transactionRepository.save(transaction);
  }

  async getTransactionSummary() {
    const transactions = await this.getTransactions();

    return {
      totalTransactions: transactions.length,
      completedRevenue: transactions
        .filter((item) => item.status === TransactionStatus.COMPLETED)
        .reduce((sum, item) => sum + Number(item.totalAmount), 0),
      pending: transactions.filter((item) => item.status === TransactionStatus.PENDING).length,
      cancelled: transactions.filter((item) => item.status === TransactionStatus.CANCELLED).length
    };
  }

  private async generateTransactionCode() {
    const count = await this.transactionRepository.count();
    return `T${String(count + 1).padStart(3, "0")}`;
  }
}
