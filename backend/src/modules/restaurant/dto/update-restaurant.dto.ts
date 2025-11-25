import { IsOptional, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRestaurantDto {
  @ApiPropertyOptional({
    description: 'Nombre del restaurante',
    example: 'La Casa del Sabor Renovada',
    minLength: 3,
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser un texto' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Dirección del restaurante',
    example: 'Calle 456 #78-90, Medellín',
    maxLength: 200,
  })
  @IsOptional()
  @IsString({ message: 'La dirección debe ser un texto' })
  @MaxLength(200, { message: 'La dirección no puede exceder 200 caracteres' })
  address?: string;

  @ApiPropertyOptional({
    description: 'Teléfono de contacto del restaurante',
    example: '+57 310 987 6543',
    minLength: 10,
    maxLength: 15,
  })
  @IsOptional()
  @IsString({ message: 'El teléfono debe ser un texto' })
  @MinLength(10, { message: 'El teléfono debe tener al menos 10 caracteres' })
  @MaxLength(15, { message: 'El teléfono no puede exceder 15 caracteres' })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Descripción del restaurante',
    example: 'Restaurante especializado en comida fusión con ingredientes locales',
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser un texto' })
  description?: string;
}
