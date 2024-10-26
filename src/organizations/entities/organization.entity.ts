import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/entities/user.entity';
import { AccessLevel } from '../enums/access-level.enum';
import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class OrganizationMember {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  @Type(() => User)
  user: User;

  @Prop({ type: String, enum: AccessLevel, default: AccessLevel.MEMBER })
  @IsString()
  access_level: AccessLevel;
}

@Schema({
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.__v;
    },
  },
  toObject: {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.__v;
    },
  },
})
export class Organization extends Document {
  @Prop({ required: true })
  @IsString()
  organization_id: string;

  @Prop({ required: true })
  @IsString()
  name: string;

  @Prop({ required: true })
  @IsString()
  description: string;

  @Prop({ type: [OrganizationMember], default: [] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrganizationMember)
  organization_members: OrganizationMember[];
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
