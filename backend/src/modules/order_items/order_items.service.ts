import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from './order_items.entity';
import { Order } from '../orders/orders.entity';
import { Product } from '../products/products.entity';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createOrderItemDto: CreateOrderItemDto): Promise<OrderItem> {
    const { orderId, productId, quantity, price } = createOrderItemDto;

    // Verificar que la orden existe
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException(`Orden con ID ${orderId} no encontrada`);
    }

    // Verificar que el producto existe
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Producto con ID ${productId} no encontrado`);
    }

    const orderItem = this.orderItemRepository.create({
      order,
      product,
      quantity,
      price,
    });

    return await this.orderItemRepository.save(orderItem);
  }

  async findAll(): Promise<OrderItem[]> {
    return await this.orderItemRepository.find({
      relations: ['order', 'product'],
      order: { id: 'DESC' }
    });
  }

  async findByOrder(orderId: number): Promise<OrderItem[]> {
    return await this.orderItemRepository.find({
      where: { order: { id: orderId } },
      relations: ['product'],
    });
  }

  async findOne(id: number): Promise<OrderItem> {
    const orderItem = await this.orderItemRepository.findOne({
      where: { id },
      relations: ['order', 'product'],
    });

    if (!orderItem) {
      throw new NotFoundException(`Item de orden con ID ${id} no encontrado`);
    }

    return orderItem;
  }

  async update(id: number, updateOrderItemDto: UpdateOrderItemDto): Promise<OrderItem> {
    const orderItem = await this.findOne(id);

    if (updateOrderItemDto.quantity !== undefined) {
      orderItem.quantity = updateOrderItemDto.quantity;
    }

    if (updateOrderItemDto.price !== undefined) {
      orderItem.price = updateOrderItemDto.price;
    }

    return await this.orderItemRepository.save(orderItem);
  }

  async remove(id: number): Promise<void> {
    const orderItem = await this.findOne(id);
    await this.orderItemRepository.remove(orderItem);
  }
}
