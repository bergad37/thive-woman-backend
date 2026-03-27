import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";
import { Transaction } from "./transaction.entity";

@Entity("transaction_items")
export class TransactionItem {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Transaction, (transaction) => transaction.items, { onDelete: "CASCADE" })
  transaction!: Transaction;

  @ManyToOne(() => Product, (product) => product.transactionItems, { eager: true, onDelete: "SET NULL", nullable: true })
  product!: Product | null;

  @Column({ default: 1 })
  quantity!: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  unitPrice!: number;
}
