import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { EntityStatus } from 'src/shared/enums/status.enum';
import { User } from 'src/users/schemas/user.schema';
import { Job } from './job.schema';

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
  })
  jobTitle: string;

  @Prop({
    required: true,
    index: true,
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
    ref: User.name,
  })
  owner: User;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: Job.name,
  })
  jobsAnalyzed: Job[];

  @Prop({
    default: EntityStatus.Active,
    trim: true,
    uppercase: true,
    maxlength: 1,
  })
  status: EntityStatus;

  isActive: () => boolean;

  isInactive: () => boolean;
}

export const ProfessionalProfileSchema =
  SchemaFactory.createForClass(ProfessionalProfile);

export const ProfessionalProfileName = 'professionalProfiles';

ProfessionalProfileSchema.methods.isActive = function (): boolean {
  return this.status === EntityStatus.Active;
};

ProfessionalProfileSchema.methods.isInactive = function (): boolean {
  return this.status === EntityStatus.Inactive;
};
