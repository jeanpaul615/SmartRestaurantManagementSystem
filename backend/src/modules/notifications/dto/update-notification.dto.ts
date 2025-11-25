import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsString } from 'class-validator';

export class UpdateNotificationDto {
  @ApiPropertyOptional({
    description: 'Mensaje de la notificación',
    example: 'Tu orden #123 ha sido entregada',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'El mensaje debe ser un texto' })
  message?: string;

  @ApiPropertyOptional({
    description: 'Estado de lectura de la notificación',
    example: true,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean({ message: 'El estado de lectura debe ser un booleano' })
  read?: boolean;
}
