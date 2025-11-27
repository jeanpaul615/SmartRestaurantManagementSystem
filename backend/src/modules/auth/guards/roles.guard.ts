import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';
import { UserRole } from '../../users/users.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obtener los roles requeridos desde los metadatos
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si no hay roles definidos, permitir el acceso
    if (!requiredRoles) {
      return true;
    }

    // Obtener el usuario del request (ya adjuntado por JwtAuthGuard)
    const request = context.switchToHttp().getRequest<{ user?: AuthenticatedUser }>();
    const { user } = request;

    // Si no hay usuario (ruta pública), denegar acceso
    if (!user) {
      throw new ForbiddenException('Autenticación requerida para acceder a este recurso');
    }

    // Verificar si el usuario tiene alguno de los roles requeridos
    const hasRole = requiredRoles.some((role) => user.role === role);

    if (!hasRole) {
      throw new ForbiddenException('No tienes permiso para acceder a este recurso');
    }

    return true;
  }
}
