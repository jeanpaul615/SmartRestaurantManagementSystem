import { IsDateString, IsOptional, IsString, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateReservationDto {
  @ApiPropertyOptional({
    description: 'Fecha y hora de la reservación',
    example: '2025-10-29T20:00:00Z',
    type: String,
  })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha debe estar en formato ISO' })
  reservationTime?: string;

  @ApiPropertyOptional({
    description: 'Estado de la reservación',
    example: 'confirmed',
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
  })
  @IsOptional()
  @IsString({ message: 'El estado debe ser un texto' })
  @IsIn(['pending', 'confirmed', 'cancelled', 'completed'], {
    message: 'Estado inválido. Debe ser: pending, confirmed, cancelled, o completed'
  })
  status?: string;
}
