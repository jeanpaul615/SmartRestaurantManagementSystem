import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItemsService } from './order_items.service';
import { OrderItemsController } from './order_items.controller';
import { OrderItem } from './order_items.entity';
import { Order } from '../orders/orders.entity';
import { Product } from '../products/products.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderItem, Order, Product])
  ],
  controllers: [OrderItemsController],
  providers: [OrderItemsService],
  exports: [OrderItemsService]
})
export class OrderItemsModule {}
