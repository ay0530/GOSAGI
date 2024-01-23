import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserRoleType } from 'src/user/types/userRole.type';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    //authenticated 먼저 확인

    //각 role 에 해당하는 값을 가져와서 저장한다. reflector
    const requiredRoles = this.reflector.getAllAndOverride<UserRoleType[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    //해당 배열에 포함되는 role이라면 true
    return requiredRoles.includes(user.role);
  }
}
