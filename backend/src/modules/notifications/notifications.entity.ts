import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/users.entity';

@Entity('notifications')
export class Notification {
  @ApiProperty({ description: 'ID único de la notificación', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Usuario destinatario de la notificación', type: () => User })
  @ManyToOne(() => User, user => user.notifications)
  user: User;

  @ApiProperty({ description: 'Mensaje de la notificación', example: 'Tu orden está lista' })
  @Column({ type: 'text' })
  message: string;

  @ApiProperty({ description: 'Estado de lectura', example: false })
  @Column({ default: false })
  read: boolean;

  @ApiProperty({ description: 'Fecha de creación', example: '2025-10-28T10:30:00.000Z' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}