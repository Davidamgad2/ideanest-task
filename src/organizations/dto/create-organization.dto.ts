import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { OrganizationMemberDto } from './organization-member.dto';

export class CreateOrganizationDto {
  @ApiProperty({ description: 'The name of the organization' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'The description of the organization' })
  @IsString()
  description: string;

  @ApiProperty({
    type: [OrganizationMemberDto],
    description: 'The members of the organization',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrganizationMemberDto)
  organization_members: OrganizationMemberDto[];
}
