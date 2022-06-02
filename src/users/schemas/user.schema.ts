import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import * as mongoose from 'mongoose';
import { RoleEntity } from '../../roles/schemas/role.schema';
import { EntityStatus } from '../../shared/enums/status.enum';
import { UserInf } from '../interfaces/user.interface';

export type UserDocument = User & mongoose.Document;

@Schema({ timestamps: true, versionKey: false })
export class User implements UserInf {
  @Prop({
    index: { unique: true },
    default: () => randomUUID(),
  })
  userId: string;

  @Prop({
    required: true,
    trim: true,
    lowercase: true,
  })
  name: string;

  @Prop({
    required: true,
    trim: true,
    lowercase: true,
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
