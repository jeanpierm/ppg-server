import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type LanguagesDocument = Languages & mongoose.Document;

@Schema({ timestamps: true, versionKey: false })
export class Languages {
  @Prop({ required: true, trim: true })
  NodeJS: number;

  @Prop({ required: true, trim: true })
  JavaScript: number;

  @Prop({ required: true, trim: true })
  TypeScript: number;

  @Prop({ required: true, trim: true })
  'C#': number;

  @Prop({ required: true, trim: true })
  'C++': number;

  @Prop({ required: true, trim: true })
  Go: number;

  @Prop({ required: true, trim: true })
  Ruby: number;

  @Prop({ required: true, trim: true })
  Dart: number;

  @Prop({ required: true, trim: true })
  C: number;

  @Prop({ required: true, trim: true })
  R: number;

  @Prop({ required: true, trim: true })
  Pascal: number;

  @Prop({ required: true, trim: true })
  Fortran: number;

  @Prop({ required: true, trim: true })
  Perl: number;

  @Prop({ required: true, trim: true })
  HTML: number;

  @Prop({ required: true, trim: true })
  PHP: number;

  @Prop({ required: true, trim: true })
  Python: number;

  @Prop({ required: true, trim: true })
  Java: number;

  @Prop({ required: true, trim: true })
  Kotlin: number;

  @Prop({ required: true, trim: true })
  'Objective-C': number;

  @Prop({ required: true, trim: true })
  Swift: number;

  @Prop({ required: true, trim: true })
  Matlab: number;

  @Prop({ required: true, trim: true })
  SQL: number;

  @Prop({ required: true, trim: true })
  CSS: number;

  @Prop({ required: true, trim: true })
  SASS: number;

  @Prop({ required: true, trim: true })
  XML: number;

  @Prop({ required: true, trim: true })
  JSON: number;
}

export const LanguagesSchema = SchemaFactory.createForClass(Languages);

export const LanguagesName = 'languagesMetadata';
