import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { User } from "./user.entity";
import { TransactionItem } from "./transaction-item.entity";

export enum PaymentMethod {
  CASH = "cash",
  CARD = "card",
  MOMO = "momo"
}

export enum TransactionStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  CANCELLED = "cancelled"
}

@Entity("transactions")
export class Transaction {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  code!: string;

  @ManyToOne(() => User, (user) => user.transactions, { eager: true, onDelete: "SET NULL", nullable: true })
  customer!: User | null;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  totalAmount!: number;

  @Column({ type: "enum", enum: PaymentMethod, default: PaymentMethod.CASH })
  paymentMethod!: PaymentMethod;

  @Column({ type: "enum", enum: TransactionStatus, default: TransactionStatus.PENDING })
  status!: TransactionStatus;

  @OneToMany(() => TransactionItem, (transactionItem) => transactionItem.transaction, { cascade: true, eager: true })
  items!: TransactionItem[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
