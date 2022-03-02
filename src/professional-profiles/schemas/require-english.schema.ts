import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type RequireEnglishDocument = RequireEnglish & mongoose.Document;

@Schema({ timestamps: true, versionKey: false })
export class RequireEnglish {
  @Prop({ required: true, trim: true, lowercase: true })
  jobTitle: string;

  @Prop({ required: true, trim: true, lowercase: true })
  location: string;

  @Prop({ required: true, trim: true })
  totalJobs: number;

  @Prop({ required: true, trim: true })
  requireEnglish: number;
}

export const RequireEnglishSchema =
  SchemaFactory.createForClass(RequireEnglish);

export const RequireEnglishName = 'requireEnglishMetadata';
