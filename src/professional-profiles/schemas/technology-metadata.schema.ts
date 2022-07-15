import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TechnologyMetadataDocument = TechnologyMetadata & Document;
@Schema({ timestamps: true, versionKey: false })
export class TechnologyMetadata {
  @Prop({
    required: true,
    index: true,
  })
  type: string;

  @Prop({ required: true, trim: true, lowercase: true })
  jobTitle: string;

  @Prop({ required: true, trim: true, lowercase: true })
  location: string;

  @Prop({ required: true })
  jobsCount: number;

  @Prop({
    required: true,
    type: Object,
  })
  countResult: Record<string, number>;
}

export const TechnologyMetadataSchema =
  SchemaFactory.createForClass(TechnologyMetadata);

export const TechnologyMetadataName = 'technologiesMetadata';
