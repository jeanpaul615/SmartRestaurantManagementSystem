import {IsNumber, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateProductDto {
    @ApiProperty({
        description: 'Nombre del producto',
        example: 'Hamburguesa Clásica',
        minLength: 3,
        maxLength: 100,
    })
    @IsString({ message: 'El nombre debe ser un texto' })
    @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
    @MaxLength(100, { message: 'El nombre no puede exceder los 100 caracteres' })
    name: string;

    @ApiPropertyOptional({
        description: 'Descripción del producto',
        example: 'Una deliciosa hamburguesa con queso',
        minLength: 10,
        maxLength: 500,
    })
    @IsString({ message: 'La descripción debe ser un texto' })
    @MinLength(10, { message: 'La descripción debe tener al menos 10 caracteres' })
    @MaxLength(500, { message: 'La descripción no puede exceder los 500 caracteres' })
    description: string;

    @ApiProperty({
        description: 'Precio del producto',
        example: 9.99,
    })
    @IsNumber({}, { message: 'El precio debe ser un número' })
    price: number;

    @ApiProperty({
        description: 'Cantidad en stock del producto',
        example: 100,
    })
    @IsNumber({}, { message: 'La cantidad en stock debe ser un número' })
    stock: number;

    @ApiPropertyOptional({
        description: 'URL de la imagen del producto',
        example: 'http://example.com/images/producto.jpg',
    })
    @IsString({ message: 'La URL de la imagen debe ser un texto' })
    imageUrl?: string;

    @IsNumber()
    restaurantId: number;
}
