import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Role, ROLES_KEY } from 'src/decorator/roles.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    console.log('user:', user);

    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
