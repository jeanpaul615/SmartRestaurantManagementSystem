import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @ApiProperty({
    description: 'ID del producto',
    example: 1,
    type: Number,
  })
  @IsNotEmpty({ message: 'El ID del producto es requerido' })
  @IsNumber({}, { message: 'El ID del producto debe ser un número' })
  productId: number;

  @ApiProperty({
    description: 'Cantidad del producto',
    example: 2,
    minimum: 1,
    type: Number,
  })
  @IsNotEmpty({ message: 'La cantidad es requerida' })
  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @Min(1, { message: 'La cantidad debe ser al menos 1' })
  quantity: number;

  @ApiProperty({
    description: 'Precio unitario del producto',
    example: 15.5,
    type: Number,
  })
  @IsNotEmpty({ message: 'El precio es requerido' })
  @IsNumber({}, { message: 'El precio debe ser un número' })
  @Min(0, { message: 'El precio debe ser mayor o igual a 0' })
  price: number;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'ID del restaurante',
    example: 1,
    type: Number,
  })
  @IsNotEmpty({ message: 'El ID del restaurante es requerido' })
  @IsNumber({}, { message: 'El ID del restaurante debe ser un número' })
  restaurantId: number;

  @ApiProperty({
    description: 'ID de la mesa',
    example: 5,
    type: Number,
  })
  @IsNotEmpty({ message: 'El ID de la mesa es requerido' })
  @IsNumber({}, { message: 'El ID de la mesa debe ser un número' })
  tableId: number;

  @ApiPropertyOptional({
    description: 'Estado de la orden',
    example: 'pending',
    enum: ['pending', 'preparing', 'ready', 'delivered', 'cancelled'],
    default: 'pending',
  })
  @IsOptional()
  @IsString({ message: 'El estado debe ser un texto' })
  status?: string;

  @ApiProperty({
    description: 'Items de la orden',
    type: [OrderItemDto],
    example: [
      { productId: 1, quantity: 2, price: 15.5 },
      { productId: 3, quantity: 1, price: 8.0 },
    ],
  })
  @IsNotEmpty({ message: 'Los items de la orden son requeridos' })
  @IsArray({ message: 'Los items deben ser un arreglo' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
