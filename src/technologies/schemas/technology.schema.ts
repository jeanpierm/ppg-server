import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { TechType } from '../../professional-profiles/enums/tech-type.enum';
import { TechnologyIntf } from '../interfaces/technology.interface';

export type TechnologyDocument = Technology & Document;

@Schema({ timestamps: true, versionKey: false })
export class Technology implements TechnologyIntf {
  @Prop({
    index: { unique: true },
    default: () => randomUUID(),
  })
  technologyId: string;

  @Prop({
    type: String,
    enum: TechType,
    required: true,
    index: true,
  })
  type: TechType;

  @Prop({
    required: true,
    index: true,
  })
  name: string;

  @Prop({
    required: true,
    type: [String],
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
