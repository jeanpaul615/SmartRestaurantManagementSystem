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
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation } from './reservations.entity';
import { CurrentUser } from '@decorators/current-user.decorator';
import { Roles } from '@decorators/roles.decorator';

@ApiTags('reservations')
@ApiBearerAuth('JWT-auth')
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear una nueva reservación',
    description: 'Crea una reservación para una mesa en un restaurante específico',
  })
  @ApiBody({
    type: CreateReservationDto,
    examples: {
      'Reservación para cena': {
        value: {
          restaurantId: 1,
          tableId: 5,
          reservationTime: '2025-10-28T19:00:00Z',
          status: 'pending',
        },
      },
      'Reservación para almuerzo': {
        value: {
          restaurantId: 2,
          tableId: 10,
          reservationTime: '2025-10-29T13:00:00Z',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Reservación creada exitosamente.', type: Reservation })
  @ApiResponse({ status: 400, description: 'Datos inválidos o fecha en el pasado.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Restaurante, mesa o usuario no encontrado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async create(
    @Body() createReservationDto: CreateReservationDto,
    @CurrentUser() user: any,
  ): Promise<Reservation> {
    return this.reservationsService.create(createReservationDto, user.id);
  }

  @Get()
  @Roles('admin', 'waiter')
  @ApiOperation({
    summary: 'Obtener todas las reservaciones (Admin/Waiter)',
    description:
      'Obtiene todas las reservaciones, opcionalmente filtradas por usuario o restaurante',
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
  @ApiResponse({ status: 200, description: 'Lista de reservaciones.', type: [Reservation] })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso prohibido.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async findAll(
    @Query('userId') userId?: number,
    @Query('restaurantId') restaurantId?: number,
  ): Promise<Reservation[]> {
    return this.reservationsService.findAll(userId, restaurantId);
  }

  @Get('my-reservations')
  @ApiOperation({
    summary: 'Obtener mis reservaciones',
    description: 'Obtiene todas las reservaciones del usuario autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de reservaciones del usuario.',
    type: [Reservation],
  })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async findMyReservations(@CurrentUser() user: any): Promise<Reservation[]> {
    return this.reservationsService.findByUser(user.id);
  }

  @Get('restaurant/:restaurantId')
  @Roles('admin', 'waiter')
  @ApiOperation({
    summary: 'Obtener reservaciones por restaurante (Admin/Waiter)',
    description: 'Obtiene todas las reservaciones de un restaurante específico',
  })
  @ApiParam({ name: 'restaurantId', description: 'ID del restaurante', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Lista de reservaciones del restaurante.',
    type: [Reservation],
  })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso prohibido.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async findByRestaurant(
    @Param('restaurantId', ParseIntPipe) restaurantId: number,
  ): Promise<Reservation[]> {
    return this.reservationsService.findByRestaurant(restaurantId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una reservación por ID',
    description: 'Obtiene los detalles completos de una reservación específica',
  })
  @ApiParam({ name: 'id', description: 'ID de la reservación', type: Number })
  @ApiResponse({ status: 200, description: 'Detalles de la reservación.', type: Reservation })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Reservación no encontrada.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Reservation> {
    return this.reservationsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar una reservación',
    description: 'Actualiza la fecha/hora o estado de una reservación',
  })
  @ApiParam({ name: 'id', description: 'ID de la reservación', type: Number })
  @ApiBody({
    type: UpdateReservationDto,
    examples: {
      'Cambiar fecha': {
        value: { reservationTime: '2025-10-29T20:00:00Z' },
      },
      'Cambiar estado': {
        value: { status: 'confirmed' },
      },
      'Actualización completa': {
        value: {
          reservationTime: '2025-10-30T18:30:00Z',
          status: 'confirmed',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Reservación actualizada exitosamente.',
    type: Reservation,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos o fecha en el pasado.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Reservación no encontrada.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReservationDto: UpdateReservationDto,
  ): Promise<Reservation> {
    return this.reservationsService.update(id, updateReservationDto);
  }

  @Patch(':id/confirm')
  @Roles('admin', 'waiter')
  @ApiOperation({
    summary: 'Confirmar una reservación (Admin/Waiter)',
    description: 'Cambia el estado de la reservación a "confirmed"',
  })
  @ApiParam({ name: 'id', description: 'ID de la reservación', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Reservación confirmada exitosamente.',
    type: Reservation,
  })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso prohibido.' })
  @ApiResponse({ status: 404, description: 'Reservación no encontrada.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async confirm(@Param('id', ParseIntPipe) id: number): Promise<Reservation> {
    return this.reservationsService.confirmReservation(id);
  }

  @Patch(':id/cancel')
  @ApiOperation({
    summary: 'Cancelar una reservación',
    description: 'Cambia el estado de la reservación a "cancelled"',
  })
  @ApiParam({ name: 'id', description: 'ID de la reservación', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Reservación cancelada exitosamente.',
    type: Reservation,
  })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Reservación no encontrada.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async cancel(@Param('id', ParseIntPipe) id: number): Promise<Reservation> {
    return this.reservationsService.cancelReservation(id);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({
    summary: 'Eliminar una reservación (Solo Admin)',
    description: 'Elimina una reservación del sistema',
  })
  @ApiParam({ name: 'id', description: 'ID de la reservación', type: Number })
  @ApiResponse({ status: 200, description: 'Reservación eliminada exitosamente.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Solo administradores pueden eliminar reservaciones.' })
  @ApiResponse({ status: 404, description: 'Reservación no encontrada.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.reservationsService.remove(id);
    return { message: 'Reservación eliminada exitosamente' };
  }
}
