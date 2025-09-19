import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../users/users.entity';
import { Tables } from '../tables/tables.entity';
import { OrderItem } from '../order_items/order_items.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.orders)
  user: User;

  @ManyToOne(() => Tables, tables => tables.orders)
  table: Tables;

  @Column({ length: 20, default: 'pending' })
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @OneToMany(() => OrderItem, orderItem => orderItem.order)
  orderItems: OrderItem[];
}