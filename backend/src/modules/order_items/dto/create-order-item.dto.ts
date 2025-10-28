import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({
    description: 'ID de la orden',
    example: 1,
    type: Number
  })
  @IsNotEmpty({ message: 'El ID de la orden es requerido' })
  @IsNumber({}, { message: 'El ID de la orden debe ser un número' })
  orderId: number;

  @ApiProperty({
    description: 'ID del producto',
    example: 3,
    type: Number
  })
  @IsNotEmpty({ message: 'El ID del producto es requerido' })
  @IsNumber({}, { message: 'El ID del producto debe ser un número' })
  productId: number;

  @ApiProperty({
    description: 'Cantidad del producto',
    example: 2,
    minimum: 1,
    type: Number
  })
  @IsNotEmpty({ message: 'La cantidad es requerida' })
  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @Min(1, { message: 'La cantidad debe ser al menos 1' })
  quantity: number;

  @ApiProperty({
    description: 'Precio unitario del producto',
    example: 15.50,
    type: Number
  })
  @IsNotEmpty({ message: 'El precio es requerido' })
  @IsNumber({}, { message: 'El precio debe ser un número' })
  @Min(0, { message: 'El precio debe ser mayor o igual a 0' })
  price: number;
}
