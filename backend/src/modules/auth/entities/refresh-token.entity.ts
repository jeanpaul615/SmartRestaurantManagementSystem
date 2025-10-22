import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/users.entity';

@Entity('refresh_tokens')
export class RefreshToken {
  
  // ID único del refresh token
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // El token en sí (hasheado)
  @Column({ type: 'text' })
  token: string;

  // Usuario al que pertenece
  @ManyToOne(() => User, user => user.refreshTokens)
  user: User;

  // ID del usuario (FK)
  @Column()
  userId: number;

  // Fecha de expiración
  @Column({ type: 'timestamp' })
  expiresAt: Date;

  // ¿Está revocado? (para logout)
  @Column({ default: false })
  isRevoked: boolean;

  // IP desde donde se creó (seguridad)
  @Column({ nullable: true })
  ipAddress: string;

  // User Agent del cliente (seguridad)
  @Column({ type: 'text', nullable: true })
  userAgent: string;

  // Fecha de creación
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  // Fecha de última actualización
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}