import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from 'src/users/schemas/users.schema';
import * as mongoose from 'mongoose';
import { EntityStatus } from 'src/shared/enums/status.enum';

export type ProfesionalProfileDocument = ProfesionalProfile & Document;

@Schema({ timestamps: true, versionKey: false })
export class ProfesionalProfile {
  @Prop({
    required: true,
    type: [String],
  })
  languages: string[];

  @Prop({
    required: true,
    type: [String],
  })
  frameworks: string[];

  @Prop({
    required: true,
    type: [String],
  })
  databases: string[];

  @Prop({
    required: true,
    type: [String],
  })
  patterns: string[];

  @Prop({
    required: true,
    type: [String],
  })
  tools: string[];

  @Prop({
    required: true,
  })
  requireEnglish: boolean;

  @Prop({
    required: true,
  })
  requireTitle: boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  owner: User;

  @Prop({
    default: EntityStatus.ACTIVE,
    trim: true,
    uppercase: true,
    maxlength: 1,
  })
  status: EntityStatus;
}

export const ProfesionalProfileSchema =
  SchemaFactory.createForClass(ProfesionalProfile);

export const ProfesionalProfileName = 'profesionalProfiles';
