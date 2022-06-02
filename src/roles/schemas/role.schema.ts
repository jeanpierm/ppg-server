import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import mongoose from 'mongoose';
import { Role } from '../../auth/enums/role.enum';
import { Option } from '../dto/option.dto';

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

  @Prop({
    schema: raw({
      icon: {
        type: String,
        required: false,
      },
      title: {
        type: String,
        required: true,
      },
      path: {
        type: String,
        required: true,
      },
    }),
    required: false,
    default: [],
  })
  options: Option[];

  createdAt: Date;

  updatedAt: Date;
}

export const RoleSchema = SchemaFactory.createForClass(RoleEntity);
export const RoleCollectionName = 'roles';
