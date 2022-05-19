import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import * as mongoose from 'mongoose';
import { Role } from 'src/auth/enums/role.enum';
import { EntityStatus } from '../../shared/enums/status.enum';

export type UserDocument = User & mongoose.Document;

@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop({
    index: { unique: true },
    default: () => randomUUID(),
  })
  userId: string;

  @Prop({ required: true, trim: true, lowercase: true })
  name: string;

  @Prop({ required: true, trim: true, lowercase: true })
  surname: string;

  @Prop({ required: true, index: { unique: true }, lowercase: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: [Role.User], type: [String] })
  roles: Role[];

  @Prop({
    default: EntityStatus.Active,
    type: String,
    enum: EntityStatus,
  })
  status: EntityStatus;
}

export const UserSchema = SchemaFactory.createForClass(User);
