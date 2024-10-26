import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { OrganizationsService } from '../../organizations/organizations.service';
import { AccessLevel } from '../../organizations/enums/access-level.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private organizationsService: OrganizationsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<AccessLevel[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const organizationId = request.params.id;

    const organization =
      await this.organizationsService.findOne(organizationId);
    const member = organization.organization_members.find(
      (member) => member.user.toString() === user.id,
    );

    if (!member) {
      throw new ForbiddenException('You are not a member of this organization');
    }

    if (!requiredRoles.includes(member.access_level)) {
      throw new ForbiddenException('You do not have the required access level');
    }

    return true;
  }
}
