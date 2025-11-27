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

  @ApiProperty({
    description: 'Fecha y hora de la reservación',
    example: '2025-10-28T19:00:00.000Z',
  })
  @Column({ type: 'timestamp' })
  reservationDate: Date;

  @ApiProperty({
    description: 'Número de comensales',
    example: 4,
  })
  @Column({ type: 'integer' })
  numberOfGuests: number;

  @ApiProperty({
    description: 'Estado de la reservación',
    example: 'pending',
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
  })
  @Column({
    type: 'enum',
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  })
  status: string;

  @ApiProperty({
    description: 'Notas adicionales',
    example: 'Mesa junto a la ventana',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  notes: string;

  @ApiProperty({ description: 'Fecha de creación' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de actualización' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ApiProperty({
    description: 'Restaurante donde se realiza la reservación',
    type: () => Restaurant,
  })
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.reservations)
  restaurant: Restaurant;

  @ApiProperty({ description: 'Usuario que realizó la reservación', type: () => User })
  @ManyToOne(() => User, (user) => user.reservations)
  user: User;

  @ApiProperty({ description: 'Mesa reservada', type: () => Tables })
  @ManyToOne(() => Tables, (table) => table.reservations)
  tables: Tables;
}
