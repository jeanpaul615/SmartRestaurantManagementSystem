import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notifications.entity';
import { User } from '../users/users.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const { userId, message, read } = createNotificationDto;

    // Verificar que el usuario existe
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    const notification = this.notificationRepository.create({
      user,
      message,
      read: read ?? false,
    });

    return await this.notificationRepository.save(notification);
  }

  async findAll(userId?: number): Promise<Notification[]> {
    const queryBuilder = this.notificationRepository
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.user', 'user');

    if (userId) {
      queryBuilder.where('notification.user.id = :userId', { userId });
    }

    queryBuilder.orderBy('notification.created_at', 'DESC');

    return await queryBuilder.getMany();
  }

  async findOne(id: number): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!notification) {
      throw new NotFoundException(`Notificación con ID ${id} no encontrada`);
    }

    return notification;
  }

  async findByUser(userId: number): Promise<Notification[]> {
    return this.findAll(userId);
  }

  async findUnreadByUser(userId: number): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: {
        user: { id: userId },
        read: false,
      },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }

  async update(id: number, updateNotificationDto: UpdateNotificationDto): Promise<Notification> {
    const notification = await this.findOne(id);

    if (updateNotificationDto.message !== undefined) {
      notification.message = updateNotificationDto.message;
    }

    if (updateNotificationDto.read !== undefined) {
      notification.read = updateNotificationDto.read;
    }

    return await this.notificationRepository.save(notification);
  }

  async markAsRead(id: number): Promise<Notification> {
    return this.update(id, { read: true });
  }

  async markAllAsReadByUser(userId: number): Promise<void> {
    await this.notificationRepository.update({ user: { id: userId }, read: false }, { read: true });
  }

  async remove(id: number): Promise<void> {
    const notification = await this.findOne(id);
    await this.notificationRepository.remove(notification);
  }

  async removeByUser(userId: number): Promise<void> {
    await this.notificationRepository.delete({ user: { id: userId } });
  }

  // Método auxiliar para crear notificaciones rápidamente
  async notifyUser(userId: number, message: string): Promise<Notification> {
    return this.create({ userId, message });
  }
}
