import * as dotenv from 'dotenv';
import * as path from 'path';

// Cargar variables de entorno según el entorno
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';

dotenv.config({ path: path.resolve(__dirname, '../../', envFile) });

import { TypeOrmModule } from '@nestjs/typeorm';

// Importa las entidades
import { User } from '../modules/users/users.entity';
import { Reservation } from '../modules/reservations/reservations.entity';
import { Tables } from '../modules/tables/tables.entity';
import { Notification } from '../modules/notifications/notifications.entity';
import { Order } from '../modules/orders/orders.entity';
import { OrderItem } from '../modules/order_items/order_items.entity';
import { Product } from '../modules/products/products.entity';
import { Restaurant } from '../modules/restaurant/restaurant.entity';
import { RefreshToken } from '../modules/auth/entities/refresh-token.entity';

// Determinar entorno
const isDevelopment = process.env.NODE_ENV !== 'production';

// Configuración de base de datos
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'SystemRestaurant',
};

// Log de configuración en desarrollo (para debugging)
if (isDevelopment) {
  console.log('🚀 NestJS - Configuración de Base de Datos:');
  console.log(`   Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Host: ${dbConfig.host}`);
  console.log(`   Port: ${dbConfig.port}`);
  console.log(`   User: ${dbConfig.username}`);
  console.log(`   Database: ${dbConfig.database}`);
  console.log(`   Password: ${dbConfig.password ? '***' : '(vacío)'}`);
  console.log(`   ⚠️  MIGRACIONES ACTIVAS - synchronize: false`);
}

export const DatabaseConfig = TypeOrmModule.forRoot({
  type: 'postgres',
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,

  // Entidades
  entities: [
    User,
    Reservation,
    Tables,
    Notification,
    Order,
    OrderItem,
    Product,
    Restaurant,
    RefreshToken,
  ],

  autoLoadEntities: true,

  synchronize: false,

  migrations: ['dist/migrations/*.js'],

  migrationsRun: false,

  logging: isDevelopment ? ['query', 'error', 'schema', 'migration'] : ['error'],

  ssl: isDevelopment ? false : { rejectUnauthorized: false },
});
