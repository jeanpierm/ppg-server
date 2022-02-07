import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserStatus } from '../enums/user-status.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true, versionKey: false })
export class User {
  // props for the types
  _id: string;

  createdAt: Date;

  updatedAt: Date;

  // user schema props
  @Prop({ required: true, trim: true, lowercase: true })
  name: string;

  @Prop({ required: true, index: { unique: true } })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, trim: true, lowercase: true })
  surname: string;

  @Prop({
    default: UserStatus.ACTIVE,
    trim: true,
    uppercase: true,
    maxlength: 1,
  })
  status: UserStatus;
}

export const UserSchema = SchemaFactory.createForClass(User);
