import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './orders.entity';
import { OrderItem } from '../order_items/order_items.entity';
import { Restaurant } from '../restaurant/restaurant.entity';
import { Tables } from '../tables/tables.entity';
import { Product } from '../products/products.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Restaurant, Tables, Product])
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService]
})
export class OrdersModule {}
