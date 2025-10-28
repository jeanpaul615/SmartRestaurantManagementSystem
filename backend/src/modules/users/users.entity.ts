import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Reservation } from '../reservations/reservations.entity';
import { Order } from '../orders/orders.entity';
import { Notification } from '../notifications/notifications.entity';
import { Restaurant } from '../restaurant/restaurant.entity';
import { RefreshToken } from '../auth/entities/refresh-token.entity';

export enum UserRole {
    ADMIN = 'admin',
    CUSTOMER = 'customer',
    WAITER = 'waiter',
    CHEF = 'chef',
}

export enum UserStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive'
}

@Entity('users')
export class User {
    @ApiProperty({ description: 'ID único del usuario', example: 1 })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: 'Nombre de usuario', example: 'john_doe', maxLength: 50 })
    @Column({ length: 50 })
    username: string;

    @ApiProperty({ description: 'Email del usuario', example: 'john@example.com', maxLength: 100 })
    @Column({ length: 100, unique: true })
    email: string;

    @ApiProperty({ description: 'Contraseña hasheada', example: '$2b$10$...', maxLength: 100 })
    @Column({ length: 100 })
    password: string;

    @ApiProperty({ description: 'Rol del usuario', enum: UserRole, example: UserRole.CUSTOMER })
    @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
    role: UserRole;

    @ApiProperty({ description: 'Estado del usuario', enum: UserStatus, example: UserStatus.ACTIVE })
    @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
    status: UserStatus;

    @ApiProperty({ description: 'Fecha de creación', example: '2025-10-28T10:30:00.000Z' })
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @ApiProperty({ description: 'Fecha de última actualización', example: '2025-10-28T10:30:00.000Z' })
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @ApiProperty({ description: 'Reservaciones del usuario', type: () => [Reservation] })
    @OneToMany(() => Reservation, reservation => reservation.user)
    reservations: Reservation[];

    @ApiProperty({ description: 'Órdenes del usuario', type: () => [Order] })
    @OneToMany(() => Order, order => order.user)
    orders: Order[];

    @ApiProperty({ description: 'Notificaciones del usuario', type: () => [Notification] })
    @OneToMany(() => Notification, notification => notification.user)
    notifications: Notification[];

    @ApiProperty({ description: 'Restaurantes asociados al usuario', type: () => [Restaurant] })
    @OneToMany(() => Restaurant, restaurant => restaurant.user)
    restaurants: Restaurant[];

    @ApiProperty({ description: 'Refresh tokens del usuario', type: () => [RefreshToken] })
    @OneToMany(() => RefreshToken, refreshToken => refreshToken.user)
    refreshTokens: RefreshToken[];
}