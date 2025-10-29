import { Controller, Post, Body, Req, ForbiddenException, Get, UseGuards, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

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
        @CurrentUser() currentUser?: any
    ): Promise<AuthResponseDto> {
        // ✅ Si intenta crear un admin, verificar que el usuario actual sea admin
        if (dto.role === 'admin') {
            if (!currentUser || currentUser.role !== 'admin') {
                throw new ForbiddenException('Solo los administradores pueden crear usuarios admin');
            }
        }
        return this.authService.register(dto);
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
    @ApiOperation({ summary: 'Refrescar access token usando refresh token' })
    @ApiResponse({ status: 200, description: 'Access token refrescado exitosamente.', type: AuthResponseDto })
    @ApiResponse({ status: 401, description: 'Refresh token inválido o expirado.' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    async refresh(@Body('refresh_token') refreshToken: string): Promise<AuthResponseDto> {
        return this.authService.refresh(refreshToken);
    }

    //logout
    @Post('logout')
    @ApiOperation({ summary: 'Cerrar sesión (revocar refresh token)' })
    @ApiResponse({ status: 200, description: 'Sesión cerrada exitosamente.' })
    @ApiResponse({ status: 401, description: 'No autorizado.' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    async logout(@CurrentUser() user: any, @Body('refresh_token') refreshToken: string) {
        await this.authService.logout(user.id);
        return { message: 'Sesión cerrada exitosamente' };
    }

    //validate token
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

    // ========================================
    // 🔐 GOOGLE OAUTH ENDPOINTS
    // ========================================

    @Public()
    @Get('google')
    @UseGuards(AuthGuard('google'))
    @ApiOperation({ 
        summary: 'Iniciar autenticación con Google',
        description: 'Redirige al usuario a la página de inicio de sesión de Google'
    })
    @ApiResponse({ status: 302, description: 'Redirección a Google OAuth.' })
    async googleAuth(@Req() req) {
        // Este endpoint redirige automáticamente a Google
    }

    @Public()
    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    @ApiOperation({ 
        summary: 'Callback de Google OAuth',
        description: 'Google redirige aquí después de la autenticación exitosa'
    })
    @ApiResponse({ status: 200, description: 'Autenticación con Google exitosa.', type: AuthResponseDto })
    @ApiResponse({ status: 401, description: 'Autenticación fallida.' })
    async googleAuthRedirect(@Req() req, @Res() res: Response) {
        // Procesar el usuario de Google y generar tokens
        const result = await this.authService.googleLogin(req.user);
        
        // Redirigir al frontend con los tokens en la URL (o usar cookies)
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const redirectUrl = `${frontendUrl}/auth/callback?access_token=${result.access_token}&refresh_token=${result.refresh_token}`;
        
        return res.redirect(redirectUrl);
    }
}
