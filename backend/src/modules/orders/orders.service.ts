import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './orders.entity';
import { OrderItem } from '../order_items/order_items.entity';
import { Restaurant } from '../restaurant/restaurant.entity';
import { Tables } from '../tables/tables.entity';
import { Product } from '../products/products.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    @InjectRepository(Tables)
    private readonly tablesRepository: Repository<Tables>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: number): Promise<Order> {
    const { restaurantId, tableId, items, status } = createOrderDto;

    // Verificar que el restaurante existe
    const restaurant = await this.restaurantRepository.findOne({ 
      where: { id: restaurantId } 
    });
    if (!restaurant) {
      throw new NotFoundException(`Restaurante con ID ${restaurantId} no encontrado`);
    }

    // Verificar que la mesa existe
    const table = await this.tablesRepository.findOne({ 
      where: { id: tableId } 
    });
    if (!table) {
      throw new NotFoundException(`Mesa con ID ${tableId} no encontrada`);
    }

    // Verificar que todos los productos existen
    for (const item of items) {
      const product = await this.productRepository.findOne({ 
        where: { id: item.productId } 
      });
      if (!product) {
        throw new NotFoundException(`Producto con ID ${item.productId} no encontrado`);
      }
    }

    // Crear la orden
    const order = this.orderRepository.create({
      restaurant,
      tables: table,
      user: { id: userId } as any,
      status: status || 'pending',
    });

    const savedOrder = await this.orderRepository.save(order);

    // Crear los items de la orden
    const orderItems = items.map(item => {
      return this.orderItemRepository.create({
        order: savedOrder,
        product: { id: item.productId } as any,
        quantity: item.quantity,
        price: item.price,
      });
    });

    await this.orderItemRepository.save(orderItems);

    // Retornar la orden completa con sus items
    return this.findOne(savedOrder.id);
  }

  async findAll(userId?: number, restaurantId?: number): Promise<Order[]> {
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.restaurant', 'restaurant')
      .leftJoinAndSelect('order.tables', 'tables')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('orderItems.product', 'product');

    if (userId) {
      queryBuilder.andWhere('order.user.id = :userId', { userId });
    }

    if (restaurantId) {
      queryBuilder.andWhere('order.restaurant.id = :restaurantId', { restaurantId });
    }

    queryBuilder.orderBy('order.created_at', 'DESC');

    return await queryBuilder.getMany();
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'restaurant', 'tables', 'orderItems', 'orderItems.product'],
    });

    if (!order) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);

    if (updateOrderDto.status) {
      order.status = updateOrderDto.status;
    }

    await this.orderRepository.save(order);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    
    // Eliminar los items de la orden primero
    await this.orderItemRepository.delete({ order: { id } });
    
    // Eliminar la orden
    await this.orderRepository.remove(order);
  }

  async findByRestaurant(restaurantId: number): Promise<Order[]> {
    return this.findAll(undefined, restaurantId);
  }

  async findByUser(userId: number): Promise<Order[]> {
    return this.findAll(userId);
  }
}
