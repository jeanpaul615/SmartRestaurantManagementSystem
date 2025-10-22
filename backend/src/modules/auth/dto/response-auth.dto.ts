import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'Token JWT de acceso' })
    access_token: string;

    @ApiProperty({ example: 'Bearer', description: 'Tipo de token' })
    token_type: string;

    @ApiProperty({ example: 3600, description: 'Tiempo de expiración en segundos' })
    expires_in: number;

    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'Token JWT de refresco' })
    refresh_token: string;

    @ApiProperty({
        example: {
            id: 1,
            username: 'Carlos Renemos',
            email: 'carlosren123@example.com',
            role: 'customer'
        },
        description: 'Información del usuario autenticado'
    })
    user: {
        id: number;
        username: string;
        email: string;
        role: string;
    };
}