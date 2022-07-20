import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type TokenDocument = Token & mongoose.Document;

@Schema({ versionKey: false })
export class Token {
  _id: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User.name,
  })
  user: User;

  @Prop({ required: true })
  token: string;

  @Prop({
    type: Date,
    default: Date.now,
    expires: 3600,
  })
  createdAt: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
