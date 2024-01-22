import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Role } from 'src/role/user.role';

@Injectable()
export class RolesGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    //authenticated 먼저 확인
    const authenticated = await super.canActivate(context);
    if (!authenticated) {
      return false;
    }

    //각 role 에 해당하는 값을 가져와서 저장한다. reflector
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log(requiredRoles);
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    //해당 배열에 포함되는 role이라면 true
    console.log(user.role);
    return requiredRoles.includes(user.role);
  }
}
