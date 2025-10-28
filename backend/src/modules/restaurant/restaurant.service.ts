import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Restaurant } from "./restaurant.entity";
import  { CreateRestaurantDto } from "./dto/create-restaurant.dto";

@Injectable()
export class RestaurantService {
    constructor(
        @InjectRepository(Restaurant)
        private restaurantRepository: Repository<Restaurant>,
    ) {}


    async CreateRestaurant(CreateRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
        const newRestaurant = this.restaurantRepository.create({...CreateRestaurantDto});
        return this.restaurantRepository.save(newRestaurant);
    }

    async FindById(id: number): Promise<Restaurant | null> {
        return this.restaurantRepository.findOne({
            where: { id },
            cache: {
                id: `restaurant-by-id-${id}`,
                milliseconds: 60000,
            },
        });
    }

    async FindAll(): Promise<Restaurant[]> {
        return this.restaurantRepository.find({
            cache: {
                id: 'restaurants',
                milliseconds: 60000,
            },
    });
    }

}
