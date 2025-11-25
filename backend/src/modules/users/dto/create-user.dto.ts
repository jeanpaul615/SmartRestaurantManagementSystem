import { IsString, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
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

  @ApiProperty({
    example: 'customer',
    description: 'El rol del usuario por ejemplo (admin, customer)',
  })
  @IsString()
  role: string;
}
