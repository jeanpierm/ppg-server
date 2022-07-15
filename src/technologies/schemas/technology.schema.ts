import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import mongoose from 'mongoose';
import { TechType } from '../../tech-types/schemas/tech-type.schema';
import { TechnologyIntf } from '../interfaces/technology.interface';

export type TechnologyDocument = Technology & mongoose.Document;

@Schema({ timestamps: true, versionKey: false })
export class Technology implements TechnologyIntf {
  @Prop({
    index: { unique: true },
    default: () => randomUUID(),
  })
  technologyId: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: TechType.name,
  })
  type: TechType;

  @Prop({
    required: true,
    index: { unique: true },
    trim: true,
  })
  name: string;

  @Prop({
    required: true,
    type: [{ type: String, lowercase: true, trim: true }],
  })
  identifiers: string[];

  @Prop({
    required: false,
    type: [String],
    default: [],
  })
  resourcesToLearn: string[];
}

export const TechnologySchema = SchemaFactory.createForClass(Technology);
export const TechnologyName = 'technologies';
