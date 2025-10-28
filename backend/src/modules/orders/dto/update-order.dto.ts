import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsIn } from 'class-validator';

export class UpdateOrderDto {
  @ApiPropertyOptional({
    description: 'Estado de la orden',
    example: 'preparing',
    enum: ['pending', 'preparing', 'ready', 'delivered', 'cancelled']
  })
  @IsOptional()
  @IsString({ message: 'El estado debe ser un texto' })
  @IsIn(['pending', 'preparing', 'ready', 'delivered', 'cancelled'], {
    message: 'Estado inválido. Debe ser: pending, preparing, ready, delivered, o cancelled'
  })
  status?: string;
}
