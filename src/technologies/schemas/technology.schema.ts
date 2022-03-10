import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { TechType } from '../../professional-profiles/enums/tech-type.enum';
import { TechDictionary } from '../dto/tech-dictionary.dto';

export type TechnologyDocument = Technology & Document;

@Schema({ timestamps: true, versionKey: false })
export class Technology {
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
    _id: false,
    required: true,
    type: raw({
      name: String,
      identifiers: {
        type: [String],
        lowercase: true,
        trim: true,
      },
    }),
  })
  dictionary: TechDictionary;
}

export const TechnologySchema = SchemaFactory.createForClass(Technology);
export const TechnologyName = 'technologies';
