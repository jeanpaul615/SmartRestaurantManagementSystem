import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, Min } from 'class-validator';

export class UpdateOrderItemDto {
  @ApiPropertyOptional({
    description: 'Cantidad del producto',
    example: 3,
    minimum: 1,
    type: Number
  })
  @IsOptional()
  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @Min(1, { message: 'La cantidad debe ser al menos 1' })
  quantity?: number;

  @ApiPropertyOptional({
    description: 'Precio unitario del producto',
    example: 18.00,
    type: Number
  })
  @IsOptional()
  @IsNumber({}, { message: 'El precio debe ser un número' })
  @Min(0, { message: 'El precio debe ser mayor o igual a 0' })
  price?: number;
}
