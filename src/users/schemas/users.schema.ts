import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  surname: string;

  @Prop({ default: 'A' })
  status: string;

  @Prop({ default: Date.now })
  createAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
