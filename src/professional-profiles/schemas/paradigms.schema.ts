import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type ParadigmsDocument = Paradigms & mongoose.Document;

@Schema({ timestamps: true, versionKey: false })
export class Paradigms {
  @Prop({ required: true, trim: true, lowercase: true })
  jobTitle: string;

  @Prop({ required: true, trim: true, lowercase: true })
  location: string;

  @Prop({ required: true, trim: true })
  totalJobs: number;

  @Prop({ required: true, trim: true })
  'Design patterns': number;

  @Prop({ required: true, trim: true })
  'Object-oriented programming': number;

  @Prop({ required: true, trim: true })
  'Functional programming': number;

  @Prop({ required: true, trim: true })
  'Reactive programming': number;
}

export const ParadigmsSchema = SchemaFactory.createForClass(Paradigms);

export const ParadigmsName = 'paradigmsMetadata';
