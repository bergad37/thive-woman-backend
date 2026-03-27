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
import { CartItem } from "./cart-item.entity";

export enum CartStatus {
  ACTIVE = "active",
  CHECKED_OUT = "checked_out",
  ABANDONED = "abandoned"
}

@Entity("carts")
export class Cart {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, (user) => user.carts, { eager: true, onDelete: "CASCADE" })
  user!: User;

  @Column({ type: "enum", enum: CartStatus, default: CartStatus.ACTIVE })
  status!: CartStatus;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { cascade: true })
  items!: CartItem[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
