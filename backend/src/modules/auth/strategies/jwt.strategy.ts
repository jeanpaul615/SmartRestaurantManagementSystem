import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key-change-this',
    });
  }

  async validate(payload: any) {

    const userId = typeof payload.sub === 'number' ? payload.sub : Number(payload.sub);
    
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
  }
}
