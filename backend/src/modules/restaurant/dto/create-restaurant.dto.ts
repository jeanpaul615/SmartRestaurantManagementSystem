import { IsNotEmpty, IsString, IsNumber, MinLength, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRestaurantDto {
  @ApiProperty({
    description: 'Nombre del restaurante',
    example: 'La Casa del Sabor',
    minLength: 3,
    maxLength: 100,
  })
  @IsString({ message: 'El nombre debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  name: string;

  @ApiProperty({
    description: 'Dirección del restaurante',
    example: 'Calle 123 #45-67, Bogotá',
    maxLength: 200,
  })
  @IsString({ message: 'La dirección debe ser un texto' })
  @IsNotEmpty({ message: 'La dirección es obligatoria' })
  @MaxLength(200, { message: 'La dirección no puede exceder 200 caracteres' })
  address: string;

  @ApiProperty({
    description: 'Teléfono de contacto del restaurante',
    example: '+57 300 123 4567',
    minLength: 10,
    maxLength: 15,
  })
  @IsString({ message: 'El teléfono debe ser un texto' })
  @IsNotEmpty({ message: 'El teléfono es obligatorio' })
  @MinLength(10, { message: 'El teléfono debe tener al menos 10 caracteres' })
  @MaxLength(15, { message: 'El teléfono no puede exceder 15 caracteres' })
  phone: string;

  @ApiPropertyOptional({
    description: 'Descripción del restaurante (opcional)',
    example: 'Restaurante especializado en comida colombiana con más de 10 años de experiencia',
    required: false,
  })
  @IsString({ message: 'La descripción debe ser un texto' })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'ID del usuario propietario del restaurante',
    example: 1,
    type: Number,
  })
  @IsNotEmpty({ message: 'El ID del usuario es obligatorio' })
  @IsNumber({}, { message: 'El ID del usuario debe ser un número' })
  userId: number;
}
