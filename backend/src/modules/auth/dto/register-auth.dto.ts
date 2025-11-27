import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@/modules/users/users.entity';

export class RegisterDto {
  @ApiProperty({ example: 'Carlos Renemos', description: 'El nombre de usuario del usuario' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'carlosren123@example.com', description: 'El email del usuario' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'strongPassword123', description: 'La contraseña del usuario' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'waiter', description: 'El rol del usuario', required: false })
  @IsOptional()
  @IsString()
  role?: UserRole;
}
