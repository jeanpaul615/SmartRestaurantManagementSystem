import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/users.entity';
import { Tables } from '../tables/tables.entity';    
import { Restaurant } from '../restaurant/restaurant.entity';

@Entity('reservations')
export class Reservation {
    @ApiProperty({ description: 'ID único de la reservación', example: 1 })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: 'Fecha y hora de la reservación', example: '2025-10-28T19:00:00.000Z' })
    @Column({ type: 'timestamp' })
    reservationTime: Date;  

    @ApiProperty({ description: 'Estado de la reservación', example: 'pending', enum: ['pending', 'confirmed', 'cancelled', 'completed'] })
    @Column({ length: 20, default: 'pending' })
    status: string;

    @ApiProperty({ description: 'Restaurante donde se realiza la reservación', type: () => Restaurant })
    @ManyToOne(() => Restaurant, restaurant => restaurant.reservations)
    restaurant: Restaurant;

    @ApiProperty({ description: 'Usuario que realizó la reservación', type: () => User })
    @ManyToOne(() => User, user => user.reservations)
    user: User;

    @ApiProperty({ description: 'Mesa reservada', type: () => Tables })
    @ManyToOne(() => Tables, table => table.reservations)
    tables: Tables;
}