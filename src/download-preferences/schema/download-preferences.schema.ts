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
    default: false,
  })
  photo: Boolean;

  @Prop({
    required: false,
    default: false,
  })
  biography: Boolean;

  @Prop({
    required: false,
    default: false,
  })
  linkedIn: Boolean;

  @Prop({
    required: false,
    default: false,
  })
  email: Boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  user: User;
}

export const DownloadPreferencesSchema =
  SchemaFactory.createForClass(DownloadPreferences);
