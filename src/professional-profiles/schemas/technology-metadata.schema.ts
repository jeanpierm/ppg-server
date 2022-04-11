import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TechType } from '../enums/tech-type.enum';

@Schema({ timestamps: true, versionKey: false })
export class TechnologyMetadata {
  @Prop({
    required: true,
    type: String,
    enum: TechType,
    index: true,
  })
  type: TechType;

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

export const TechnologyMetadataSchema = SchemaFactory.createForClass(TechnologyMetadata);

export const TechnologyMetadataName = 'technologiesMetadata';
