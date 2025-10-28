import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { User } from '../users/users.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Injectable()
export class RestaurantService {
    constructor(
        @InjectRepository(Restaurant)
        private readonly restaurantRepository: Repository<Restaurant>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async create(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
        const { userId, ...restaurantData } = createRestaurantDto;

        // Verificar que el usuario existe
        const user = await this.userRepository.findOne({
            where: { id: userId }
        });

        if (!user) {
            throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
        }

        const newRestaurant = this.restaurantRepository.create({
            ...restaurantData,
            user,
        });

        return await this.restaurantRepository.save(newRestaurant);
    }

    async findAll(): Promise<Restaurant[]> {
        return await this.restaurantRepository.find({
            relations: ['user'],
            select: {
                user: {
                    id: true,
                    username: true,
                    email: true,
                }
            },
            order: { name: 'ASC' }
        });
    }

    async findOne(id: number): Promise<Restaurant> {
        const restaurant = await this.restaurantRepository.findOne({
            where: { id },
            relations: ['user'],
            select: {
                user: {
                    id: true,
                    username: true,
                    email: true,
                }
            }
        });

        if (!restaurant) {
            throw new NotFoundException(`Restaurante con ID ${id} no encontrado`);
        }

        return restaurant;
    }

    async findByUser(userId: number): Promise<Restaurant[]> {
        return await this.restaurantRepository.find({
            where: { user: { id: userId } },
            relations: ['user'],
            order: { name: 'ASC' }
        });
    }

    async update(id: number, updateRestaurantDto: UpdateRestaurantDto): Promise<Restaurant> {
        const restaurant = await this.findOne(id);

        Object.assign(restaurant, updateRestaurantDto);

        return await this.restaurantRepository.save(restaurant);
    }

    async remove(id: number): Promise<void> {
        const restaurant = await this.findOne(id);
        await this.restaurantRepository.remove(restaurant);
    }

    // Métodos legacy para compatibilidad
    async CreateRestaurant(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
        return this.create(createRestaurantDto);
    }

    async FindById(id: number): Promise<Restaurant | null> {
        try {
            return await this.findOne(id);
        } catch {
            return null;
        }
    }

    async FindAll(): Promise<Restaurant[]> {
        return this.findAll();
    }
}
