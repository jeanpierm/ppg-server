import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import mongoose from 'mongoose';
import { Role } from '../../auth/enums/role.enum';

export type RoleDocument = RoleEntity & mongoose.Document;

@Schema({ timestamps: true, versionKey: false })
export class RoleEntity {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({
    index: { unique: true },
    default: () => randomUUID(),
  })
  roleId: string;

  @Prop({
    required: true,
    enum: Role,
    index: { unique: true },
  })
  name: Role;

  createdAt: Date;

  updatedAt: Date;
}

export const RoleSchema = SchemaFactory.createForClass(RoleEntity);
export const RoleCollectionName = 'roles';
