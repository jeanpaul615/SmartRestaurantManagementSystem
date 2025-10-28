import { Module, Res } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '@modules/users/users.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { RestaurantModule } from '@/modules/restaurant/restaurant.module';
import { DatabaseConfig } from '@config/Database';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Hace que el ConfigModule esté disponible globalmente
    }),
    DatabaseConfig,
    UsersModule,
    AuthModule,
    RestaurantModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Aplicar JwtAuthGuard globalmente a todas las rutas
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // Aplicar RolesGuard globalmente
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
