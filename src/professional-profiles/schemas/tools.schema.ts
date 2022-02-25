import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type ToolsDocument = Tools & mongoose.Document;

@Schema({ timestamps: true, versionKey: false })
export class Tools {
  @Prop({ required: true, trim: true })
  Docker: number;

  @Prop({ required: true, trim: true })
  Terraform: number;

  @Prop({ required: true, trim: true })
  Jenkins: number;

  @Prop({ required: true, trim: true })
  Git: number;

  @Prop({ required: true, trim: true })
  Kubernetes: number;

  @Prop({ required: true, trim: true })
  Openshift: number;

  @Prop({ required: true, trim: true })
  'CI/CD': number;

  @Prop({ required: true, trim: true })
  NPM: number;

  @Prop({ required: true, trim: true })
  Webpack: number;

  @Prop({ required: true, trim: true })
  Maven: number;

  @Prop({ required: true, trim: true })
  Gradle: number;

  @Prop({ required: true, trim: true })
  Firebase: number;

  @Prop({ required: true, trim: true })
  'Amazon Web Services (AWS)': number;

  @Prop({ required: true, trim: true })
  'Microsoft Azure': number;

  @Prop({ required: true, trim: true })
  'Google Cloud': number;

  @Prop({ required: true, trim: true })
  Heroku: number;

  @Prop({ required: true, trim: true })
  Netlify: number;

  @Prop({ required: true, trim: true })
  Vercel: number;

  @Prop({ required: true, trim: true })
  DigitalOcean: number;
}

export const ToolsSchema = SchemaFactory.createForClass(Tools);

export const ToolsName = 'toolsMetadata';
