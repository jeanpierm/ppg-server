import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import * as mongoose from 'mongoose';
import { RoleEntity } from '../../roles/schemas/role.schema';
import { EntityStatus } from '../../shared/enums/status.enum';
import { UserIntf } from '../interfaces/user.interface';

export type UserDocument = User & mongoose.Document;

@Schema({ timestamps: true, versionKey: false })
export class User implements UserIntf {
  _id: mongoose.Types.ObjectId;

  @Prop({
    index: { unique: true },
    default: () => randomUUID(),
  })
  userId: string;

  @Prop({
    required: true,
    trim: true,
  })
  name: string;

  @Prop({
    required: true,
    trim: true,
  })
  surname: string;

  @Prop({
    required: true,
    index: { unique: true },
    lowercase: true,
  })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false, trim: true })
  biography?: string;

  @Prop({ required: false, trim: true })
  linkedIn?: string;

  @Prop({ required: false, trim: true })
  github?: string;

  @Prop({ required: false, trim: true })
  portfolio?: string;

  @Prop({ required: true, trim: true })
  jobTitle: string;

  @Prop({ required: true, trim: true })
  location: string;

  @Prop({ required: false, trim: true })
  photo?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: RoleEntity.name,
  })
  role: RoleEntity;

  @Prop({
    default: EntityStatus.Active,
    type: String,
    enum: EntityStatus,
  })
  status: EntityStatus;

  createdAt: Date;

  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
