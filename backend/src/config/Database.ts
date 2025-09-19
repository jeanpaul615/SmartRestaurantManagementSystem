import * as dotenv from 'dotenv';
dotenv.config();

import { TypeOrmModule } from "@nestjs/typeorm";

// Importa las entidades aquí
import { User } from '../modules/users/users.entity';
import { Reservation } from '../modules/reservations/reservations.entity';
import { Tables } from 'src/modules/tables/tables.entity';
import { Notification } from 'src/modules/notifications/notifications.entity';
import { Order } from 'src/modules/orders/orders.entity';
import { OrderItem } from 'src/modules/order_items/order_items.entity';
import { Product } from 'src/modules/products/products.entity';

// Configuración de la base de datos utilizando TypeORM

export const DatabaseConfig = TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'test',
    autoLoadEntities: true,
    synchronize: true,
    logging: false,
    entities: [User, Reservation, Tables, Notification, Order, OrderItem, Product], // Todas las entidades importadas
});