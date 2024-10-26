import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AccessLevel } from '../enums/access-level.enum';

export class OrganizationMemberDto {
  @ApiProperty({ description: 'The name of the member' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'The email of the member' })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The access level of the member',
    enum: AccessLevel,
  })
  @IsString()
  access_level: AccessLevel;
}
