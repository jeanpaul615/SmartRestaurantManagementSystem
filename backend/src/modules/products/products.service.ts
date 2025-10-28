import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './products.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

    createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(product);
    }

    async getAllProducts(): Promise<Product[]> {
    return this.productsRepository.find();
    }

    async getProductById(id: number): Promise<Product | null> {
    return this.productsRepository.findOne({ where: { id } });
    }

    async updateProduct(id: number, updateProductDto: Partial<CreateProductDto>): Promise<Product | null> {
    await this.productsRepository.update(id, updateProductDto);
    return this.getProductById(id);
    }

    async deleteProduct(id: number): Promise<void> {
    await this.productsRepository.delete(id);
    }
}