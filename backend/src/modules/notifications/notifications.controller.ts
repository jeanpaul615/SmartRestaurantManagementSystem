import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './notifications.entity';
import { CurrentUser } from '@decorators/current-user.decorator';
import { Roles } from '@decorators/roles.decorator';
import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { UserRole } from '../users/users.entity';

@ApiTags('notifications')
@ApiBearerAuth('JWT-auth')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.WAITER, UserRole.CHEF)
  @ApiOperation({
    summary: 'Crear una nueva notificación (Admin/Waiter/Chef)',
    description: 'Crea una notificación para un usuario específico',
  })
  @ApiBody({
    type: CreateNotificationDto,
    examples: {
      'Notificación de orden lista': {
        value: {
          userId: 5,
          message: 'Tu orden #123 está lista para ser recogida',
        },
      },
      'Notificación de reservación': {
        value: {
          userId: 10,
          message: 'Tu reservación para 4 personas está confirmada para mañana a las 19:00',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Notificación creada exitosamente.',
    type: Notification,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso prohibido.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async create(@Body() createNotificationDto: CreateNotificationDto): Promise<Notification> {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Obtener todas las notificaciones (Solo Admin)',
    description: 'Obtiene todas las notificaciones del sistema',
  })
  @ApiResponse({ status: 200, description: 'Lista de notificaciones.', type: [Notification] })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso prohibido.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async findAll(): Promise<Notification[]> {
    return this.notificationsService.findAll();
  }

  @Get('my-notifications')
  @ApiOperation({
    summary: 'Obtener mis notificaciones',
    description: 'Obtiene todas las notificaciones del usuario autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de notificaciones del usuario.',
    type: [Notification],
  })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async findMyNotifications(@CurrentUser() user: AuthenticatedUser): Promise<Notification[]> {
    return this.notificationsService.findByUser(user.id);
  }

  @Get('my-notifications/unread')
  @ApiOperation({
    summary: 'Obtener mis notificaciones no leídas',
    description: 'Obtiene todas las notificaciones no leídas del usuario autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de notificaciones no leídas.',
    type: [Notification],
  })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async findMyUnreadNotifications(@CurrentUser() user: AuthenticatedUser): Promise<Notification[]> {
    return this.notificationsService.findUnreadByUser(user.id);
  }

  @Patch('my-notifications/mark-all-read')
  @ApiOperation({
    summary: 'Marcar todas mis notificaciones como leídas',
    description: 'Marca todas las notificaciones del usuario autenticado como leídas',
  })
  @ApiResponse({ status: 200, description: 'Todas las notificaciones marcadas como leídas.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async markAllAsRead(@CurrentUser() user: AuthenticatedUser): Promise<{ message: string }> {
    await this.notificationsService.markAllAsReadByUser(user.id);
    return { message: 'Todas las notificaciones marcadas como leídas' };
  }

  @Get('user/:userId')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Obtener notificaciones de un usuario (Solo Admin)',
    description: 'Obtiene todas las notificaciones de un usuario específico',
  })
  @ApiParam({ name: 'userId', description: 'ID del usuario', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Lista de notificaciones del usuario.',
    type: [Notification],
  })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso prohibido.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async findByUser(@Param('userId', ParseIntPipe) userId: number): Promise<Notification[]> {
    return this.notificationsService.findByUser(userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una notificación por ID',
    description: 'Obtiene los detalles de una notificación específica',
  })
  @ApiParam({ name: 'id', description: 'ID de la notificación', type: Number })
  @ApiResponse({ status: 200, description: 'Detalles de la notificación.', type: Notification })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Notificación no encontrada.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Notification> {
    return this.notificationsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar una notificación',
    description: 'Actualiza el mensaje o estado de lectura de una notificación',
  })
  @ApiParam({ name: 'id', description: 'ID de la notificación', type: Number })
  @ApiBody({
    type: UpdateNotificationDto,
    examples: {
      'Marcar como leída': {
        value: { read: true },
      },
      'Actualizar mensaje': {
        value: { message: 'Tu orden #123 ha sido entregada' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Notificación actualizada exitosamente.',
    type: Notification,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Notificación no encontrada.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    return this.notificationsService.update(id, updateNotificationDto);
  }

  @Patch(':id/mark-read')
  @ApiOperation({
    summary: 'Marcar notificación como leída',
    description: 'Marca una notificación específica como leída',
  })
  @ApiParam({ name: 'id', description: 'ID de la notificación', type: Number })
  @ApiResponse({ status: 200, description: 'Notificación marcada como leída.', type: Notification })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Notificación no encontrada.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async markAsRead(@Param('id', ParseIntPipe) id: number): Promise<Notification> {
    return this.notificationsService.markAsRead(id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar una notificación',
    description: 'Elimina una notificación específica',
  })
  @ApiParam({ name: 'id', description: 'ID de la notificación', type: Number })
  @ApiResponse({ status: 200, description: 'Notificación eliminada exitosamente.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Notificación no encontrada.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.notificationsService.remove(id);
    return { message: 'Notificación eliminada exitosamente' };
  }

  @Delete('user/:userId')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Eliminar todas las notificaciones de un usuario (Solo Admin)',
    description: 'Elimina todas las notificaciones de un usuario específico',
  })
  @ApiParam({ name: 'userId', description: 'ID del usuario', type: Number })
  @ApiResponse({ status: 200, description: 'Notificaciones eliminadas exitosamente.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso prohibido.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async removeByUser(@Param('userId', ParseIntPipe) userId: number): Promise<{ message: string }> {
    await this.notificationsService.removeByUser(userId);
    return { message: 'Todas las notificaciones del usuario eliminadas exitosamente' };
  }
}
