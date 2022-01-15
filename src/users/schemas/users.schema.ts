import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true, lowercase: true })
  name: string;

  @Prop({ required: true, index: { unique: true } })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, trim: true, lowercase: true })
  surname: string;

  @Prop({ default: 'A', trim: true, uppercase: true, maxlength: 1 })
  status: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
