import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from '../orders/orders.entity';
import { Product } from '../products/products.entity';

@Entity('order_items')
export class OrderItem {
  @ApiProperty({ description: 'ID único del item', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Cantidad del producto', example: 2 })
  @Column()
  quantity: number;

  @ApiProperty({ description: 'Precio unitario del producto', example: 15.5 })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ApiProperty({ description: 'Orden a la que pertenece el item', type: () => Order })
  @ManyToOne(() => Order, (order) => order.orderItems)
  order: Order;

  @ApiProperty({ description: 'Producto asociado al item', type: () => Product })
  @ManyToOne(() => Product, (product) => product.orderItems)
  product: Product;
}
