import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, Table, OneToMany } from 'typeorm';
import { User } from '../users/users.entity';
import { Tables } from '../tables/tables.entity';
import { Product } from '../products/products.entity';
import { Reservation } from '../reservations/reservations.entity';
import { Order } from '../orders/orders.entity';

@Entity('restaurants')
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 100 })
  name: string;
  @Column({ length: 200 })
  address: string;
  @Column({ length: 15 })
  phone: string;
  @Column({ type: 'text', nullable: true })
  description: string;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.restaurants, { eager: true })
  user: User;

  @OneToMany(() => Tables, (table) => table.restaurant)
  tables: Tables[];

  @OneToMany(() => Product, (product) => product.restaurant)
  products: Product[];

  @OneToMany(() => Reservation, (reservation) => reservation.restaurant)
  reservations: Reservation[];

  @OneToMany(() => Order, (order) => order.restaurant)
  orders: Order[];
}
