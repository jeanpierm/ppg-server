import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type PatternsDocument = Patterns & mongoose.Document;

@Schema({ timestamps: true, versionKey: false })
export class Patterns {
  @Prop({ required: true, trim: true })
  MVVM: number;

  @Prop({ required: true, trim: true })
  MVP: number;

  @Prop({ required: true, trim: true })
  SOLID: number;

  @Prop({ required: true, trim: true })
  REST: number;

  @Prop({ required: true, trim: true })
  Flux: number;

  @Prop({ required: true, trim: true })
  Redux: number;

  @Prop({ required: true, trim: true })
  GrapQl: number;

  @Prop({ required: true, trim: true })
  SOAP: number;

  @Prop({ required: true, trim: true })
  MVC: number;

  @Prop({ required: true, trim: true })
  AJAX: number;

  @Prop({ required: true, trim: true })
  Microservicios: number;

  @Prop({ required: true, trim: true })
  Hexagonal: number;

  @Prop({ required: true, trim: true })
  'Clean Code': number;

  @Prop({ required: true, trim: true })
  'Test-Driven Development (TDD)': number;

  @Prop({ required: true, trim: true })
  'Domain-Driven Design (DDD)': number;

  @Prop({ required: true, trim: true })
  Singleton: number;

  @Prop({ required: true, trim: true })
  'Inyección de dependencias': number;
}

export const PatternsSchema = SchemaFactory.createForClass(Patterns);

export const PatternsName = 'patternsMetadata';
