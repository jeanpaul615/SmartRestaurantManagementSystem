import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'ID del usuario destinatario',
    example: 1,
    type: Number
  })
  @IsNotEmpty({ message: 'El ID del usuario es requerido' })
  @IsNumber({}, { message: 'El ID del usuario debe ser un número' })
  userId: number;

  @ApiProperty({
    description: 'Mensaje de la notificación',
    example: 'Tu orden #123 está lista para ser recogida',
    type: String
  })
  @IsNotEmpty({ message: 'El mensaje es requerido' })
  @IsString({ message: 'El mensaje debe ser un texto' })
  message: string;

  @ApiPropertyOptional({
    description: 'Estado de lectura de la notificación',
    example: false,
    default: false,
    type: Boolean
  })
  @IsOptional()
  @IsBoolean({ message: 'El estado de lectura debe ser un booleano' })
  read?: boolean;
}
