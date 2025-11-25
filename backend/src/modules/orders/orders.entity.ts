import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/users.entity';
import { Tables } from '../tables/tables.entity';
import { OrderItem } from '../order_items/order_items.entity';
import { Restaurant } from '../restaurant/restaurant.entity';

@Entity('orders')
export class Order {
  @ApiProperty({ description: 'ID único de la orden', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Estado de la orden', example: 'pending' })
  @Column({ length: 20, default: 'pending' })
  status: string;

  @ApiProperty({
    description: 'Fecha de creación de la orden',
    example: '2025-10-28T10:30:00.000Z',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ApiProperty({ description: 'Restaurante asociado a la orden', type: () => Restaurant })
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.orders)
  restaurant: Restaurant;

  @ApiProperty({ description: 'Usuario que realizó la orden', type: () => User })
  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @ApiProperty({ description: 'Mesa asignada a la orden', type: () => Tables })
  @ManyToOne(() => Tables, (table) => table.orders)
  tables: Tables;

  @ApiProperty({ description: 'Items de la orden', type: () => [OrderItem] })
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];
}
