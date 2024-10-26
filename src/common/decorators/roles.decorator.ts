import { SetMetadata } from '@nestjs/common';
import { AccessLevel } from '../../organizations/enums/access-level.enum';

export const Roles = (...roles: AccessLevel[]) => SetMetadata('roles', roles);
