import { IsNumber, IsString, MinLength, MaxLength, IsOptional, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductDto {
    @ApiPropertyOptional({
        description: 'Nombre del producto',
        example: 'Hamburguesa Premium',
        minLength: 3,
        maxLength: 100,
    })
    @IsOptional()
    @IsString({ message: 'El nombre debe ser un texto' })
    @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
    @MaxLength(100, { message: 'El nombre no puede exceder los 100 caracteres' })
    name?: string;

    @ApiPropertyOptional({
        description: 'Descripción del producto',
        example: 'Hamburguesa premium con queso gourmet y bacon',
    })
    @IsOptional()
    @IsString({ message: 'La descripción debe ser un texto' })
    description?: string;

    @ApiPropertyOptional({
        description: 'Precio del producto',
        example: 15.99,
        minimum: 0,
    })
    @IsOptional()
    @IsNumber({}, { message: 'El precio debe ser un número' })
    @Min(0, { message: 'El precio debe ser mayor o igual a 0' })
    price?: number;

    @ApiPropertyOptional({
        description: 'Cantidad en stock del producto',
        example: 75,
        minimum: 0,
    })
    @IsOptional()
    @IsNumber({}, { message: 'La cantidad en stock debe ser un número' })
    @Min(0, { message: 'El stock debe ser mayor o igual a 0' })
    stock?: number;

    @ApiPropertyOptional({
        description: 'URL de la imagen del producto',
        example: 'https://example.com/images/hamburguesa-premium.jpg',
    })
    @IsOptional()
    @IsString({ message: 'La URL de la imagen debe ser un texto' })
    imageUrl?: string;
}
