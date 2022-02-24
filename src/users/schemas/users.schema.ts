import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { EntityStatus } from '../../shared/enums/status.enum';

export type UserDocument = User & mongoose.Document;

@Schema({ timestamps: true, versionKey: false })
export class User {
  // props for the types
  _id: mongoose.Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;

  // user schema props
  @Prop({ required: true, trim: true, lowercase: true })
  name: string;

  @Prop({ required: true, index: { unique: true }, lowercase: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, trim: true, lowercase: true })
  surname: string;

  @Prop({
    default: EntityStatus.ACTIVE,
    trim: true,
    uppercase: true,
    maxlength: 1,
  })
  status: EntityStatus;
}

export const UserSchema = SchemaFactory.createForClass(User);
