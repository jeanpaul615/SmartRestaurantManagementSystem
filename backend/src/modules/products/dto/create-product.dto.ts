import {
  IsNumber,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  Min,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Hamburguesa Clásica',
    minLength: 3,
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser un texto' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede exceder los 100 caracteres' })
  name: string;

  @ApiPropertyOptional({
    description: 'Descripción del producto',
    example: 'Una deliciosa hamburguesa con queso cheddar, lechuga, tomate y salsa especial',
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser un texto' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Categoría del producto',
    example: 'Pizza',
    maxLength: 50,
  })
  @IsOptional()
  @IsString({ message: 'La categoría debe ser un texto' })
  @MaxLength(50, { message: 'La categoría no puede exceder los 50 caracteres' })
  category?: string;

  @ApiProperty({
    description: 'Precio del producto',
    example: 12.5,
    minimum: 0,
  })
  @IsNotEmpty({ message: 'El precio es requerido' })
  @IsNumber({}, { message: 'El precio debe ser un número' })
  @Min(0, { message: 'El precio debe ser mayor o igual a 0' })
  price: number;

  @ApiProperty({
    description: 'Cantidad en stock del producto',
    example: 50,
    minimum: 0,
    default: 0,
  })
  @IsOptional()
  @IsNumber({}, { message: 'La cantidad en stock debe ser un número' })
  @Min(0, { message: 'El stock debe ser mayor o igual a 0' })
  stock?: number;

  @ApiPropertyOptional({
    description: 'URL de la imagen del producto',
    example: 'https://example.com/images/hamburguesa.jpg',
  })
  @IsOptional()
  @IsString({ message: 'La URL de la imagen debe ser un texto' })
  imageUrl?: string;

  @ApiProperty({
    description: 'ID del restaurante al que pertenece el producto',
    example: 1,
    type: Number,
  })
  @IsNotEmpty({ message: 'El ID del restaurante es requerido' })
  @IsNumber({}, { message: 'El ID del restaurante debe ser un número' })
  restaurantId: number;
}
