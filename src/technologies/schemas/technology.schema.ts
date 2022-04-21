import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose } from 'class-transformer';
import { randomUUID } from 'crypto';
import { TechType } from '../../professional-profiles/enums/tech-type.enum';
import { TechnologyIntf } from '../interfaces/technology.interface';

export type TechnologyDocument = Technology & Document;

@Schema({ timestamps: true, versionKey: false })
export class Technology implements TechnologyIntf {
  @Expose()
  @Prop({
    index: { unique: true },
    default: () => randomUUID(),
  })
  technologyId: string;

  @Expose()
  @Prop({
    type: String,
    enum: TechType,
    required: true,
    index: true,
  })
  type: TechType;

  @Expose()
  @Prop({
    required: true,
    index: true,
  })
  name: string;

  @Expose()
  @Prop({
    required: true,
    type: [String],
  })
  identifiers: string[];
}

export const TechnologySchema = SchemaFactory.createForClass(Technology);
export const TechnologyName = 'technologies';
