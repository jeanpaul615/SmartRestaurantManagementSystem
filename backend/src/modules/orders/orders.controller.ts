import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './orders.entity';
import { CurrentUser } from '@decorators/current-user.decorator';
import { Roles } from '@decorators/roles.decorator';
import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { UserRole } from '../users/users.entity';

@ApiTags('orders')
@ApiBearerAuth('JWT-auth')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear una nueva orden',
    description: 'Crea una nueva orden con sus items asociados',
  })
  @ApiBody({
    type: CreateOrderDto,
    examples: {
      'Orden de comida rápida': {
        value: {
          restaurantId: 1,
          tableId: 5,
          status: 'pending',
          items: [
            { productId: 1, quantity: 2, price: 15.5 },
            { productId: 3, quantity: 1, price: 8.0 },
          ],
        },
      },
      'Orden de restaurante': {
        value: {
          restaurantId: 2,
          tableId: 10,
          items: [
            { productId: 5, quantity: 1, price: 25.0 },
            { productId: 7, quantity: 2, price: 12.5 },
            { productId: 9, quantity: 3, price: 5.0 },
          ],
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Orden creada exitosamente.', type: Order })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Restaurante, mesa o producto no encontrado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<Order> {
    return this.ordersService.create(createOrderDto, user.id);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las órdenes',
    description: 'Obtiene todas las órdenes, opcionalmente filtradas por usuario o restaurante',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'Filtrar por ID de usuario',
    type: Number,
  })
  @ApiQuery({
    name: 'restaurantId',
    required: false,
    description: 'Filtrar por ID de restaurante',
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'Lista de órdenes.', type: [Order] })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async findAll(
    @Query('userId') userId?: number,
    @Query('restaurantId') restaurantId?: number,
  ): Promise<Order[]> {
    return this.ordersService.findAll(userId, restaurantId);
  }

  @Get('my-orders')
  @ApiOperation({
    summary: 'Obtener mis órdenes',
    description: 'Obtiene todas las órdenes del usuario autenticado',
  })
  @ApiResponse({ status: 200, description: 'Lista de órdenes del usuario.', type: [Order] })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async findMyOrders(@CurrentUser() user: AuthenticatedUser): Promise<Order[]> {
    return this.ordersService.findByUser(user.id);
  }

  @Get('restaurant/:restaurantId')
  @Roles(UserRole.ADMIN, UserRole.WAITER, UserRole.CHEF)
  @ApiOperation({
    summary: 'Obtener órdenes por restaurante (Admin/Waiter/Chef)',
    description: 'Obtiene todas las órdenes de un restaurante específico',
  })
  @ApiParam({ name: 'restaurantId', description: 'ID del restaurante', type: Number })
  @ApiResponse({ status: 200, description: 'Lista de órdenes del restaurante.', type: [Order] })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso prohibido.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async findByRestaurant(
    @Param('restaurantId', ParseIntPipe) restaurantId: number,
  ): Promise<Order[]> {
    return this.ordersService.findByRestaurant(restaurantId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una orden por ID',
    description: 'Obtiene los detalles completos de una orden específica',
  })
  @ApiParam({ name: 'id', description: 'ID de la orden', type: Number })
  @ApiResponse({ status: 200, description: 'Detalles de la orden.', type: Order })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Order> {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.WAITER, UserRole.CHEF)
  @ApiOperation({
    summary: 'Actualizar estado de una orden (Admin/Waiter/Chef)',
    description: 'Actualiza el estado de una orden existente',
  })
  @ApiParam({ name: 'id', description: 'ID de la orden', type: Number })
  @ApiBody({
    type: UpdateOrderDto,
    examples: {
      'Marcar como preparando': {
        value: { status: 'preparing' },
      },
      'Marcar como lista': {
        value: { status: 'ready' },
      },
      'Marcar como entregada': {
        value: { status: 'delivered' },
      },
      'Cancelar orden': {
        value: { status: 'cancelled' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Orden actualizada exitosamente.', type: Order })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso prohibido.' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Eliminar una orden (Solo Admin)',
    description: 'Elimina una orden y todos sus items asociados',
  })
  @ApiParam({ name: 'id', description: 'ID de la orden', type: Number })
  @ApiResponse({ status: 200, description: 'Orden eliminada exitosamente.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Solo administradores pueden eliminar órdenes.' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.ordersService.remove(id);
    return { message: 'Orden eliminada exitosamente' };
  }
}
