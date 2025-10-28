import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReservationDto {
  @IsNotEmpty()
  @IsDateString()
  reservationTime: string; // Se envía como string ISO (ej: "2025-10-28T19:00:00Z")

  @IsOptional()
  @IsString()
  status?: string; // opcional, ya que el default es 'pending'

  @IsNotEmpty()
  @IsNumber()
  restaurantId: number;

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  tableId: number;
}
