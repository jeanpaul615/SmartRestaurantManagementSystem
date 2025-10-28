import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './restaurant.entity';
import { User } from '../users/users.entity';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Restaurant, User])],
    providers: [RestaurantService],
    controllers: [RestaurantController],
    exports: [RestaurantService], 
})
export class RestaurantModule {}