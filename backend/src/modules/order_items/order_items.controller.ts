import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { OrderItemsService } from './order_items.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { OrderItem } from './order_items.entity';
import { Roles } from '@decorators/roles.decorator';
import { UserRole } from '../users/users.entity';

@ApiTags('order-items')
@ApiBearerAuth('JWT-auth')
@Controller('order-items')
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.WAITER)
  @ApiOperation({
    summary: 'Agregar un item a una orden (Admin/Waiter)',
    description: 'Agrega un nuevo item a una orden existente',
  })
  @ApiBody({
    type: CreateOrderItemDto,
    examples: {
      'Agregar producto': {
        value: {
          orderId: 1,
          productId: 3,
          quantity: 2,
          price: 15.5,
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Item agregado exitosamente.', type: OrderItem })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso prohibido.' })
  @ApiResponse({ status: 404, description: 'Orden o producto no encontrado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async create(@Body() createOrderItemDto: CreateOrderItemDto): Promise<OrderItem> {
    return this.orderItemsService.create(createOrderItemDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Obtener todos los items de órdenes (Solo Admin)',
    description: 'Obtiene todos los items de todas las órdenes',
  })
  @ApiResponse({ status: 200, description: 'Lista de items de órdenes.', type: [OrderItem] })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso prohibido.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async findAll(): Promise<OrderItem[]> {
    return this.orderItemsService.findAll();
  }

  @Get('order/:orderId')
  @ApiOperation({
    summary: 'Obtener items de una orden específica',
    description: 'Obtiene todos los items asociados a una orden',
  })
  @ApiParam({ name: 'orderId', description: 'ID de la orden', type: Number })
  @ApiResponse({ status: 200, description: 'Lista de items de la orden.', type: [OrderItem] })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async findByOrder(@Param('orderId', ParseIntPipe) orderId: number): Promise<OrderItem[]> {
    return this.orderItemsService.findByOrder(orderId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un item de orden por ID',
    description: 'Obtiene los detalles de un item específico',
  })
  @ApiParam({ name: 'id', description: 'ID del item', type: Number })
  @ApiResponse({ status: 200, description: 'Detalles del item.', type: OrderItem })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Item no encontrado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<OrderItem> {
    return this.orderItemsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.WAITER)
  @ApiOperation({
    summary: 'Actualizar un item de orden (Admin/Waiter)',
    description: 'Actualiza la cantidad o precio de un item de orden',
  })
  @ApiParam({ name: 'id', description: 'ID del item', type: Number })
  @ApiBody({
    type: UpdateOrderItemDto,
    examples: {
      'Actualizar cantidad': {
        value: { quantity: 3 },
      },
      'Actualizar precio': {
        value: { price: 18.0 },
      },
      'Actualizar cantidad y precio': {
        value: { quantity: 2, price: 16.5 },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Item actualizado exitosamente.', type: OrderItem })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso prohibido.' })
  @ApiResponse({ status: 404, description: 'Item no encontrado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderItemDto: UpdateOrderItemDto,
  ): Promise<OrderItem> {
    return this.orderItemsService.update(id, updateOrderItemDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.WAITER)
  @ApiOperation({
    summary: 'Eliminar un item de orden (Admin/Waiter)',
    description: 'Elimina un item de una orden',
  })
  @ApiParam({ name: 'id', description: 'ID del item', type: Number })
  @ApiResponse({ status: 200, description: 'Item eliminado exitosamente.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso prohibido.' })
  @ApiResponse({ status: 404, description: 'Item no encontrado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.orderItemsService.remove(id);
    return { message: 'Item de orden eliminado exitosamente' };
  }
}
