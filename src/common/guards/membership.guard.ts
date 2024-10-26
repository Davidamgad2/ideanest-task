import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { OrganizationsService } from '../../organizations/organizations.service';

@Injectable()
export class MembershipGuard implements CanActivate {
  constructor(private organizationsService: OrganizationsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
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

    return true;
  }
}
