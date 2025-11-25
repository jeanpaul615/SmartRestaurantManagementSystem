import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      // 🍪 Extraer token desde cookies en lugar de Authorization header
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          // Primero intentar desde cookies
          let token = request?.cookies?.access_token;

          // Si no hay en cookies, intentar desde header (backwards compatibility)
          if (!token) {
            const authHeader = request?.headers?.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
              token = authHeader.substring(7);
            }
          }

          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key-change-this',
    });
  }

  async validate(payload: any) {
    try {
      // payload contiene: { sub: userId, email, role, iat, exp }
      const userId = typeof payload.sub === 'number' ? payload.sub : Number(payload.sub);

      // Buscar usuario en la base de datos
      const user = await this.usersService.FindById(userId);

      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado o inactivo');
      }

      // Validación adicional: verificar si el usuario está activo
      if (user.status !== 'active') {
        throw new UnauthorizedException('Usuario inactivo');
      }

      // El objeto retornado se adjunta automáticamente a request.user
      return {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      };
    } catch (error) {
      // Si es un error de autenticación conocido, re-lanzarlo
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      // Si es otro tipo de error (BD, etc), loguear y rechazar
      console.error('Error validando token JWT:', error);
      throw new UnauthorizedException('Error de autenticación');
    }
  }
}
