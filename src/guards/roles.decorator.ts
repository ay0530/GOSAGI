import { UserRoleType } from 'src/user/types/userRole.type';

import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: UserRoleType[]) => SetMetadata('roles', roles);
