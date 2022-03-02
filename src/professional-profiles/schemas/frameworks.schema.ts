import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type FrameworksDocument = Frameworks & mongoose.Document;

@Schema({ timestamps: true, versionKey: false })
export class Frameworks {
  @Prop({ required: true, trim: true, lowercase: true })
  jobTitle: string;

  @Prop({ required: true, trim: true, lowercase: true })
  location: string;

  @Prop({ required: true, trim: true })
  totalJobs: number;

  @Prop({ required: true, trim: true })
  VueJS: number;

  @Prop({ required: true, trim: true })
  NuxtJS: number;

  @Prop({ required: true, trim: true })
  ReactJS: number;

  @Prop({ required: true, trim: true })
  'React Native': number;

  @Prop({ required: true, trim: true })
  NextJS: number;

  @Prop({ required: true, trim: true })
  Angular: number;

  @Prop({ required: true, trim: true })
  Ionic: number;

  @Prop({ required: true, trim: true })
  MeteorJS: number;

  @Prop({ required: true, trim: true })
  LoopBack: number;

  @Prop({ required: true, trim: true })
  AngularJS: number;

  @Prop({ required: true, trim: true })
  ExpressJS: number;

  @Prop({ required: true, trim: true })
  FastifyJS: number;

  @Prop({ required: true, trim: true })
  NestJS: number;

  @Prop({ required: true, trim: true })
  Gatsby: number;

  @Prop({ required: true, trim: true })
  Svelte: number;

  @Prop({ required: true, trim: true })
  EmberJS: number;

  @Prop({ required: true, trim: true })
  'Spring Boot': number;

  @Prop({ required: true, trim: true })
  Quarkus: number;

  @Prop({ required: true, trim: true })
  'Microsoft dotNET': number;

  @Prop({ required: true, trim: true })
  'Entity Framework': number;

  @Prop({ required: true, trim: true })
  Django: number;

  @Prop({ required: true, trim: true })
  FastAPI: number;

  @Prop({ required: true, trim: true })
  Flask: number;

  @Prop({ required: true, trim: true })
  Laravel: number;

  @Prop({ required: true, trim: true })
  Blade: number;

  @Prop({ required: true, trim: true })
  Symfony: number;

  @Prop({ required: true, trim: true })
  Lumel: number;

  @Prop({ required: true, trim: true })
  'Ruby on Rails': number;

  @Prop({ required: true, trim: true })
  Flutter: number;

  @Prop({ required: true, trim: true })
  Xamarin: number;
}

export const FrameworksSchema = SchemaFactory.createForClass(Frameworks);

export const FrameworksName = 'frameworksMetadata';
