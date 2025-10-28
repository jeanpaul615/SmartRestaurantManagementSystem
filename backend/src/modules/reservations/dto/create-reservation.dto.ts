import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReservationDto {
  @ApiProperty({
    description: 'Fecha y hora de la reservación',
    example: '2025-10-28T19:00:00Z',
    type: String,
  })
  @IsNotEmpty({ message: 'La fecha y hora de reservación es requerida' })
  @IsDateString({}, { message: 'La fecha debe estar en formato ISO' })
  reservationTime: string;

  @ApiPropertyOptional({
    description: 'Estado de la reservación',
    example: 'pending',
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  })
  @IsOptional()
  @IsString({ message: 'El estado debe ser un texto' })
  status?: string;

  @ApiProperty({
    description: 'ID del restaurante',
    example: 1,
    type: Number,
  })
  @IsNotEmpty({ message: 'El ID del restaurante es requerido' })
  @IsNumber({}, { message: 'El ID del restaurante debe ser un número' })
  restaurantId: number;

  @ApiProperty({
    description: 'ID de la mesa a reservar',
    example: 5,
    type: Number,
  })
  @IsNotEmpty({ message: 'El ID de la mesa es requerido' })
  @IsNumber({}, { message: 'El ID de la mesa debe ser un número' })
  tableId: number;
}
