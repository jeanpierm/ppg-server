import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from 'src/users/schemas/users.schema';
import * as mongoose from 'mongoose';
import { EntityStatus } from 'src/shared/enums/status.enum';
import { randomUUID } from 'crypto';

export type ProfessionalProfileDocument = ProfessionalProfile & Document;

@Schema({ timestamps: true, versionKey: false })
export class ProfessionalProfile {
  @Prop({
    index: { unique: true },
    default: () => randomUUID(),
  })
  ppId: string;

  @Prop({
    required: true,
    index: true,
    lowercase: true,
  })
  jobTitle: string;

  @Prop({
    required: true,
    index: true,
    lowercase: true,
  })
  location: string;

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
  libraries: string[];

  @Prop({
    required: true,
    type: [String],
  })
  tools: string[];

  @Prop({
    required: true,
    type: [String],
  })
  paradigms: string[];

  @Prop({
    required: true,
  })
  requireEnglish: boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  owner: User;

  @Prop({
    default: EntityStatus.Active,
    trim: true,
    uppercase: true,
    maxlength: 1,
  })
  status: EntityStatus;
}

export const ProfessionalProfileSchema = SchemaFactory.createForClass(ProfessionalProfile);

export const ProfessionalProfileName = 'professionalProfiles';
