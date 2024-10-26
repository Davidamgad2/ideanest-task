import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from './entities/organization.entity';
import { UsersService } from 'src/users/users.service';
import { AccessLevel } from './enums/access-level.enum';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectModel(Organization.name)
    private organizationModel: Model<Organization>,
    private usersService: UsersService,
  ) {}

  async create(
    createOrganizationDto: CreateOrganizationDto,
    createdBy: string,
  ): Promise<Organization> {
    // Fetch the user who is creating the organization
    const user = await this.usersService.findById(createdBy);
    if (!user) {
      throw new NotFoundException(`User with ID ${createdBy} not found`);
    }

    // Add the creator as a member with ADMIN access level
    const organizationMembers = [
      ...(createOrganizationDto.organization_members || []),
      {
        user: { name: user.name, email: user.email } as User,
        access_level: AccessLevel.ADMIN,
      },
    ];

    const createdOrganization = new this.organizationModel({
      ...createOrganizationDto,
      organization_id: new this.organizationModel()._id, // Ensure organization_id is set
      organization_members: organizationMembers,
    });

    return createdOrganization.save();
  }

  async findAll(): Promise<Organization[]> {
    return this.organizationModel
      .find()
      .populate({
        path: 'organization_members.user',
        select: 'name email',
      })
      .exec();
  }

  async findOne(id: string): Promise<Organization> {
    const organization = await this.organizationModel
      .findById(id)
      .populate('organization_members.user', 'name email')
      .exec();
    if (!organization) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }
    return organization;
  }

  async update(
    id: string,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<Organization> {
    const updatedOrganization = await this.organizationModel
      .findByIdAndUpdate(id, updateOrganizationDto, { new: true })
      .exec();
    if (!updatedOrganization) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }
    return updatedOrganization;
  }

  async remove(id: string): Promise<Organization> {
    const deletedOrganization = await this.organizationModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedOrganization) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }
    return deletedOrganization;
  }
  async addMember(
    organizationId: string,
    userEmail: string,
  ): Promise<Organization> {
    const organization = await this.organizationModel.findById(organizationId);
    if (!organization) {
      throw new NotFoundException(
        `Organization with ID ${organizationId} not found`,
      );
    }

    const user = await this.usersService.findByEmail(userEmail);
    if (!user) {
      throw new NotFoundException(`User with ID ${userEmail} not found`);
    }
    const isMember = organization.organization_members.some((member) => {
      return member.user?.email === userEmail;
    });

    if (isMember) {
      throw new BadRequestException(
        'User is already a member of this organization',
      );
    }
    organization.organization_members.push({
      user: { name: user.name, email: user.email } as User,
      access_level: AccessLevel.MEMBER,
    });

    return organization.save();
  }
}
