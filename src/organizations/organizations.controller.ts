import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { MembershipGuard } from 'src/common/guards/membership.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Request } from 'express';
import { AccessLevel } from './enums/access-level.enum';
@ApiTags('Organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Create a new organization' })
  @ApiBody({ type: CreateOrganizationDto })
  @Post()
  create(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @Req() req: Request,
  ) {
    const user = req.user['id'];
    return this.organizationsService.create(createOrganizationDto, user);
  }

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('jwt-auth')
  @Get()
  @ApiOperation({ summary: 'Get all organizations' })
  findAll() {
    return this.organizationsService.findAll();
  }

  @UseGuards(AccessTokenGuard, MembershipGuard)
  @ApiBearerAuth('jwt-auth')
  @Get(':id')
  @ApiOperation({ summary: 'Get an organization by ID' })
  findOne(@Param('id') id: string) {
    return this.organizationsService.findOne(id);
  }

  @ApiBearerAuth('jwt-auth')
  @UseGuards(AccessTokenGuard, MembershipGuard, RolesGuard)
  @Roles(AccessLevel.ADMIN, AccessLevel.SUPERVISOR)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Update an organization by ID' })
  @ApiBody({ type: UpdateOrganizationDto })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationsService.update(id, updateOrganizationDto);
  }

  @ApiBearerAuth('jwt-auth')
  @UseGuards(AccessTokenGuard, MembershipGuard, RolesGuard)
  @Roles(AccessLevel.ADMIN)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Delete an organization by ID' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationsService.remove(id);
  }

  @ApiBearerAuth('jwt-auth')
  @UseGuards(AccessTokenGuard, MembershipGuard, RolesGuard)
  @Roles(AccessLevel.ADMIN, AccessLevel.SUPERVISOR)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'invite to organization by ID and user email' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
      },
      example: {
        email: 'enter-user-email',
      },
    },
  })
  @Post(':id/invite')
  invite(@Param('id') id: string, @Body() inviteDto: { email: string }) {
    this.organizationsService.addMember(id, inviteDto.email);
    return { message: 'User added to organization' };
  }
}
