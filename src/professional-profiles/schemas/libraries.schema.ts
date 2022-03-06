import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type LibrariesDocument = Libraries & mongoose.Document;

@Schema({ timestamps: true, versionKey: false })
export class Libraries {
  @Prop({ required: true, trim: true, lowercase: true })
  jobTitle: string;

  @Prop({ required: true, trim: true, lowercase: true })
  location: string;

  @Prop({ required: true, trim: true })
  totalJobs: number;

  @Prop({ required: true, trim: true })
  jQuery: number;

  @Prop({ required: true, trim: true })
  Lodash: number;

  @Prop({ required: true, trim: true })
  Jest: number;

  @Prop({ required: true, trim: true })
  Cypress: number;

  @Prop({ required: true, trim: true })
  Bootstrap: number;

  @Prop({ required: true, trim: true })
  'Tailwind CSS': number;

  @Prop({ required: true, trim: true })
  Mockito: number;

  @Prop({ required: true, trim: true })
  JMockit: number;

  @Prop({ required: true, trim: true })
  JUnit: number;
}

export const LibrariesSchema = SchemaFactory.createForClass(Libraries);

export const LibrariesName = 'librariesMetadata';
