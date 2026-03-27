import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { Cart } from "../entities/cart.entity";
import { CartItem } from "../entities/cart-item.entity";
import { Product } from "../entities/product.entity";
import { Transaction } from "../entities/transaction.entity";
import { TransactionItem } from "../entities/transaction-item.entity";
import { User } from "../entities/user.entity";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "thrive_woman_db",
  synchronize: true,
  logging: false,
  entities: [User, Product, Cart, CartItem, Transaction, TransactionItem]
});
