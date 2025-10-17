import { Controller, Get, Post, Body, Put, Delete, Param, Query, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { User } from '../users/users.entity';

//DTOs
import { LoginDto } from './dto/login-auth.dto';
import { AuthResponseDto } from './dto/response-auth.dto';
import { RegisterDto } from './dto/register-auth.dto';

//GUARDS & DECORATORS
import { Public } from '@decorators/public.decorator';
import { CurrentUser } from '@decorators/current-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }
    //Login
    @Public() 
    @Post('login')
    @ApiOperation({ summary: 'Iniciar sesión' })
    @ApiResponse({ status: 200, description: 'Inicio de sesión exitoso.', type: User })
    @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
    @ApiResponse({ status: 401, description: 'No autorizado.' })
    @ApiResponse({ status: 403, description: 'Acceso prohibido.' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
        return this.authService.login(dto);
    }

    //register
    @Public() 
    @Post('register')
    @ApiOperation({ summary: 'Registrar un nuevo usuario' })
    @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente.', type: AuthResponseDto })
    @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
    @ApiResponse({ status: 401, description: 'No autorizado.' })
    @ApiResponse({ status: 403, description: 'Acceso prohibido.' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    async register(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
        return this.authService.register(dto);
    }   

    
}
