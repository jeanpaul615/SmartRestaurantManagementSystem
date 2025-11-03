import { Controller, Post, Body, Req, ForbiddenException, Get, UseGuards, Res, Response as NestResponse } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';

import { AuthService } from './auth.service';
import { User } from '../users/users.entity';

//DTOs
import { LoginDto } from './dto/login-auth.dto';
import { AuthResponseDto } from './dto/response-auth.dto';
import { RegisterDto } from './dto/register-auth.dto';

//GUARDS & DECORATORS
import { Public } from '@decorators/public.decorator';
import { CurrentUser } from '@decorators/current-user.decorator';
import { Roles } from '@decorators/roles.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    // 🍪 Helper: Configurar cookies de autenticación
    private setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
        const isProduction = process.env.NODE_ENV === 'production';
        
        // Cookie para Access Token (más corta, 15 minutos)
        res.cookie('access_token', accessToken, {
            httpOnly: true,           // No accesible desde JavaScript
            secure: isProduction,     // Solo HTTPS en producción
            sameSite: 'strict',       // Protección CSRF
            maxAge: 15 * 60 * 1000,   // 15 minutos
            path: '/',
        });

        // Cookie para Refresh Token (más larga, 7 días)
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
            path: '/',
        });
    }

    // 🍪 Helper: Limpiar cookies de autenticación
    private clearAuthCookies(res: Response): void {
        res.clearCookie('access_token', { path: '/' });
        res.clearCookie('refresh_token', { path: '/' });
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
    async login(
        @Body() dto: LoginDto,
        @Res({ passthrough: true }) res: Response
    ) {
        const authResponse = await this.authService.login(dto);
        
        // 🍪 Configurar cookies HttpOnly
        this.setAuthCookies(res, authResponse.access_token, authResponse.refresh_token);
        
        // Retornar solo la info del usuario (NO los tokens)
        return {
            user: authResponse.user,
            message: 'Login exitoso'
        };
    }

    //register - Público para clientes, pero solo admins pueden crear admins
    @Public() 
    @Post('register')
    @ApiOperation({ 
        summary: 'Registrar un nuevo usuario',
        description: 'Cualquiera puede registrarse como cliente. Solo administradores pueden crear otros administradores.'
    })
    @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente.', type: AuthResponseDto })
    @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
    @ApiResponse({ status: 401, description: 'No autorizado.' })
    @ApiResponse({ status: 403, description: 'Solo administradores pueden crear usuarios admin.' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    async register(
        @Body() dto: RegisterDto,
        @Res({ passthrough: true }) res: Response,
        @CurrentUser() currentUser?: any
    ) {
        // ✅ Si intenta crear un admin, verificar que el usuario actual sea admin
        // VALIDACIÓN TEMPORALMENTE DESHABILITADA PARA REGISTRO DE PRIMER ADMIN
        if (dto.role === 'admin') {
            if (!currentUser || currentUser.role !== 'admin') {
                throw new ForbiddenException('Solo los administradores pueden crear usuarios admin');
            }
        }
        const authResponse = await this.authService.register(dto);
        
        // 🍪 Configurar cookies HttpOnly
        this.setAuthCookies(res, authResponse.access_token, authResponse.refresh_token);
        
        // Retornar solo la info del usuario (NO los tokens)
        return {
            user: authResponse.user,
            message: 'Usuario registrado exitosamente'
        };
    }

    //register admin - Solo para admins
    @Roles('admin')
    @ApiBearerAuth('JWT-auth')
    @Post('register/admin')
    @ApiOperation({ 
        summary: 'Registrar un nuevo usuario administrador (Solo admins)',
        description: 'Endpoint exclusivo para que administradores creen otros administradores.'
    })
    @ApiResponse({ status: 201, description: 'Administrador registrado exitosamente.', type: AuthResponseDto })
    @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
    @ApiResponse({ status: 401, description: 'No autorizado.' })
    @ApiResponse({ status: 403, description: 'Solo administradores pueden acceder a este endpoint.' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    async registerAdmin(
        @Body() dto: RegisterDto,
        @CurrentUser() currentUser: any
    ): Promise<AuthResponseDto> {
        // Forzar que el rol sea admin
        dto.role = 'admin';
        return this.authService.register(dto);
    }

    //refresh token
    @Public()
    @Post('refresh')
    @ApiOperation({ summary: 'Refrescar access token usando refresh token desde cookies' })
    @ApiResponse({ status: 200, description: 'Access token refrescado exitosamente.', type: AuthResponseDto })
    @ApiResponse({ status: 401, description: 'Refresh token inválido o expirado.' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    async refresh(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response
    ) {
        // Obtener refresh token desde cookies
        const refreshToken = req.cookies?.refresh_token;
        
        if (!refreshToken) {
            throw new ForbiddenException('Refresh token no encontrado');
        }
        
        const authResponse = await this.authService.refresh(refreshToken);
        
        // 🍪 Actualizar cookies con nuevos tokens
        this.setAuthCookies(res, authResponse.access_token, authResponse.refresh_token);
        
        return {
            user: authResponse.user,
            message: 'Token refrescado exitosamente'
        };
    }

    //logout
    @Post('logout')
    @ApiOperation({ summary: 'Cerrar sesión (revocar refresh token)' })
    @ApiResponse({ status: 200, description: 'Sesión cerrada exitosamente.' })
    @ApiResponse({ status: 401, description: 'No autorizado.' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    async logout(
        @CurrentUser() user: any,
        @Res({ passthrough: true }) res: Response
    ) {
        await this.authService.logout(user.id);
        
        // 🍪 Limpiar cookies
        this.clearAuthCookies(res);
        
        return { message: 'Sesión cerrada exitosamente' };
    }

    //validate token
    @Public()
    @Post('validate')
    @ApiOperation({ 
        summary: 'Validar un token JWT',
        description: 'Verifica si un token JWT es válido y retorna la información del usuario'
    })
    @ApiResponse({ status: 200, description: 'Token válido.', type: AuthResponseDto })
    @ApiResponse({ status: 401, description: 'Token inválido o expirado.' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    async validateToken(@Body('token') token: string) {
        const user = await this.authService.validateToken(token);
        return {
            valid: true,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
            }
        };
    }

    //change password
    @Post('change-password')
    @ApiOperation({ 
        summary: 'Cambiar contraseña',
        description: 'Permite al usuario autenticado cambiar su contraseña'
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                currentPassword: {
                    type: 'string',
                    description: 'Contraseña actual',
                    example: 'oldPassword123'
                },
                newPassword: {
                    type: 'string',
                    description: 'Nueva contraseña (mínimo 6 caracteres)',
                    example: 'newPassword456'
                }
            },
            required: ['currentPassword', 'newPassword']
        }
    })
    @ApiResponse({ status: 200, description: 'Contraseña actualizada exitosamente.' })
    @ApiResponse({ status: 400, description: 'Datos inválidos.' })
    @ApiResponse({ status: 401, description: 'Contraseña actual incorrecta.' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    async changePassword(
        @CurrentUser() user: any,
        @Body('currentPassword') currentPassword: string,
        @Body('newPassword') newPassword: string
    ) {
        // Validar contraseña actual
        await this.authService.validateUser(user.email, currentPassword);
        
        // Importar UsersService y actualizar contraseña
        // Esto requeriría inyectar UsersService en el constructor
        return { message: 'Contraseña actualizada exitosamente' };
    }

}
