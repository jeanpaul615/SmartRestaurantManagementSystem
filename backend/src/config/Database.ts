import * as dotenv from 'dotenv';
dotenv.config();

import { TypeOrmModule } from '@nestjs/typeorm';

// Importa las entidades aquí
import { User } from '../modules/users/users.entity';
import { Reservation } from '../modules/reservations/reservations.entity';
import { Tables } from '../modules/tables/tables.entity';
import { Notification } from '../modules/notifications/notifications.entity';
import { Order } from '../modules/orders/orders.entity';
import { OrderItem } from '../modules/order_items/order_items.entity';
import { Product } from '../modules/products/products.entity';
import { Restaurant } from '../modules/restaurant/restaurant.entity';

// Configuración de la base de datos utilizando TypeORM

export const DatabaseConfig = TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'test',
  autoLoadEntities: true,
  synchronize: process.env.NODE_ENV !== 'production',
  migrations: ['dist/migrations/*.js'],
  migrationsRun: false,
  logging: false,
  entities: [User, Reservation, Tables, Notification, Order, OrderItem, Product, Restaurant], // Todas las entidades importadas
});
