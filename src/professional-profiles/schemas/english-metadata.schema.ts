import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type EnglishMetadataDocument = EnglishMetadata & mongoose.Document;

@Schema({ timestamps: true, versionKey: false })
export class EnglishMetadata {
  @Prop({ required: true, trim: true, lowercase: true })
  jobTitle: string;

  @Prop({ required: true, trim: true, lowercase: true })
  location: string;

  @Prop({ required: true, trim: true })
  jobsCount: number;

  @Prop({ required: true, trim: true })
  requireCount: number;
}

export const EnglishMetadataSchema =
  SchemaFactory.createForClass(EnglishMetadata);

export const EnglishName = 'requireEnglishMetadata';
