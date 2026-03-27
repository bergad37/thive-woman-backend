import { AppDataSource } from "../config/data-source";
import { Cart, CartStatus } from "../entities/cart.entity";
import { CartItem } from "../entities/cart-item.entity";
import { Product } from "../entities/product.entity";
import { User } from "../entities/user.entity";
import { AppError } from "../utils/app-error";

export class CartService {
  private cartRepository = AppDataSource.getRepository(Cart);
  private cartItemRepository = AppDataSource.getRepository(CartItem);
  private productRepository = AppDataSource.getRepository(Product);
  private userRepository = AppDataSource.getRepository(User);

  async getOrCreateActiveCart(userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    let cart = await this.cartRepository.findOne({
      where: {
        user: { id: userId },
        status: CartStatus.ACTIVE
      },
      relations: ["items", "items.product"]
    });

    if (!cart) {
      cart = this.cartRepository.create({
        user,
        status: CartStatus.ACTIVE,
        items: []
      });
      cart = await this.cartRepository.save(cart);
    }

    return cart;
  }

  async getCartById(id: string) {
    const cart = await this.cartRepository.findOne({
      where: { id },
      relations: ["items", "items.product", "user"]
    });

    if (!cart) {
      throw new AppError("Cart not found", 404);
    }

    return cart;
  }

  async addItem(userId: string, productId: string, quantity: number) {
    if (quantity <= 0) {
      throw new AppError("Quantity must be greater than zero");
    }

    const cart = await this.getOrCreateActiveCart(userId);
    const product = await this.productRepository.findOneBy({ id: productId });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    if (product.stockQuantity < quantity) {
      throw new AppError("Not enough stock available");
    }

    let cartItem = await this.cartItemRepository.findOne({
      where: {
        cart: { id: cart.id },
        product: { id: productId }
      },
      relations: ["cart", "product"]
    });

    if (cartItem) {
      const newQuantity = cartItem.quantity + quantity;
      if (product.stockQuantity < newQuantity) {
        throw new AppError("Requested quantity exceeds product stock");
      }
      cartItem.quantity = newQuantity;
    } else {
      cartItem = this.cartItemRepository.create({
        cart,
        product,
        quantity,
        unitPrice: product.price
      });
    }

    await this.cartItemRepository.save(cartItem);
    return this.getCartById(cart.id);
  }

  async updateItemQuantity(userId: string, itemId: string, quantity: number) {
    if (quantity <= 0) {
      throw new AppError("Quantity must be greater than zero");
    }

    const cart = await this.getOrCreateActiveCart(userId);
    const item = await this.cartItemRepository.findOne({
      where: {
        id: itemId,
        cart: { id: cart.id }
      },
      relations: ["product", "cart"]
    });

    if (!item) {
      throw new AppError("Cart item not found", 404);
    }

    if (item.product.stockQuantity < quantity) {
      throw new AppError("Requested quantity exceeds product stock");
    }

    item.quantity = quantity;
    await this.cartItemRepository.save(item);
    return this.getCartById(cart.id);
  }

  async removeItem(userId: string, itemId: string) {
    const cart = await this.getOrCreateActiveCart(userId);
    const item = await this.cartItemRepository.findOne({
      where: {
        id: itemId,
        cart: { id: cart.id }
      }
    });

    if (!item) {
      throw new AppError("Cart item not found", 404);
    }

    await this.cartItemRepository.remove(item);
    return this.getCartById(cart.id);
  }

  async clearCart(userId: string) {
    const cart = await this.getOrCreateActiveCart(userId);
    await this.cartItemRepository.delete({
      cart: { id: cart.id }
    });
    return this.getCartById(cart.id);
  }
}
