import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderItem } from '../order_items/order_items.entity';
import { Restaurant } from '../restaurant/restaurant.entity';

@Entity('products')
export class Product {
  @ApiProperty({ description: 'ID único del producto', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Nombre del producto', example: 'Pizza Margherita', maxLength: 100 })
  @Column({ length: 100 })
  name: string;

  @ApiPropertyOptional({ description: 'Descripción del producto', example: 'Pizza clásica con tomate, mozzarella y albahaca' })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ description: 'Precio del producto', example: 12.50, type: Number })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ApiProperty({ description: 'Stock disponible', example: 50, default: 0 })
  @Column({ default: 0 })
  stock: number;

  @ApiPropertyOptional({ description: 'URL de la imagen del producto', example: 'https://example.com/pizza.jpg' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  imageUrl: string;

  @ApiProperty({ description: 'Restaurante al que pertenece el producto', type: () => Restaurant })
  @ManyToOne(() => Restaurant, restaurant => restaurant.products)
  restaurant: Restaurant;

  @ApiProperty({ description: 'Items de órdenes asociados', type: () => [OrderItem] })
  @OneToMany(() => OrderItem, orderItem => orderItem.product)
  orderItems: OrderItem[];
}