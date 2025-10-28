import { IsString, IsEmail, IsOptional, IsEnum, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole, UserStatus } from '../users.entity';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Nombre de usuario',
    example: 'john_updated',
    minLength: 3,
  })
  @IsOptional()
  @IsString({ message: 'El nombre de usuario debe ser un texto' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  username?: string;

  @ApiPropertyOptional({
    description: 'Email del usuario',
    example: 'john.updated@example.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'El email debe ser válido' })
  email?: string;

  @ApiPropertyOptional({
    description: 'Nueva contraseña',
    example: 'newPassword123',
    minLength: 6,
  })
  @IsOptional()
  @IsString({ message: 'La contraseña debe ser un texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password?: string;

  @ApiPropertyOptional({
    description: 'Rol del usuario',
    enum: UserRole,
    example: UserRole.WAITER,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Rol inválido' })
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'Estado del usuario',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(UserStatus, { message: 'Estado inválido' })
  status?: UserStatus;
}
