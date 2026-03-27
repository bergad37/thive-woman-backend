import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CartItem } from "./cart-item.entity";
import { TransactionItem } from "./transaction-item.entity";

export enum ProductCategory {
  PREMIUM = "premium",
  SOCIAL = "social"
}

export enum ProductStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  OUT_OF_STOCK = "out_of_stock"
}

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  subtitle!: string;

  @Column({ type: "enum", enum: ProductCategory, default: ProductCategory.SOCIAL })
  category!: ProductCategory;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  price!: number;

  @Column({ default: 0 })
  stockQuantity!: number;

  @Column({ default: 0 })
  distributedQuantity!: number;

  @Column({ type: "enum", enum: ProductStatus, default: ProductStatus.ACTIVE })
  status!: ProductStatus;

  @Column({ default: true })
  isActive!: boolean;

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems!: CartItem[];

  @OneToMany(() => TransactionItem, (transactionItem) => transactionItem.product)
  transactionItems!: TransactionItem[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
