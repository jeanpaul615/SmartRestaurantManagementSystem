import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './products.entity';
import { Restaurant } from '../restaurant/restaurant.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { restaurantId, ...productData } = createProductDto;

    // Verificar que el restaurante existe
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurante con ID ${restaurantId} no encontrado`);
    }

    const product = this.productsRepository.create({
      ...productData,
      restaurant,
    });

    return await this.productsRepository.save(product);
  }

  async findAll(restaurantId?: number): Promise<Product[]> {
    const queryBuilder = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.restaurant', 'restaurant');

    if (restaurantId) {
      queryBuilder.where('product.restaurant.id = :restaurantId', { restaurantId });
    }

    queryBuilder.orderBy('product.name', 'ASC');

    return await queryBuilder.getMany();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['restaurant'],
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return product;
  }

  async findByRestaurant(restaurantId: number): Promise<Product[]> {
    return this.findAll(restaurantId);
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);

    Object.assign(product, updateProductDto);

    return await this.productsRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);
  }

  async updateStock(id: number, quantity: number): Promise<Product> {
    const product = await this.findOne(id);
    product.stock += quantity;

    if (product.stock < 0) {
      product.stock = 0;
    }

    return await this.productsRepository.save(product);
  }
}
