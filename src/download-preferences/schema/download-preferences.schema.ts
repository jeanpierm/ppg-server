import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import mongoose from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type DownloadPreferencesDocument = DownloadPreferences & Document;

@Schema({ timestamps: true, versionKey: false })
export class DownloadPreferences {
  @Prop({
    index: { unique: true },
    default: () => randomUUID(),
  })
  dpId: string;

  @Prop({
    required: false,
    default: true,
  })
  photo: boolean;

  @Prop({
    required: false,
    default: true,
  })
  biography: boolean;

  @Prop({
    required: false,
    default: true,
  })
  linkedIn: boolean;

  @Prop({
    required: false,
    default: true,
  })
  email: boolean;

  @Prop({
    required: false,
    default: true,
  })
  github: boolean;

  @Prop({
    required: false,
    default: true,
  })
  portfolio: boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  user: User;
}

export const DownloadPreferencesSchema =
  SchemaFactory.createForClass(DownloadPreferences);
