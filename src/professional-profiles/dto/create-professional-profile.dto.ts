import { Types } from 'mongoose';

export class CreateProfessionalProfile {
  readonly jobTitle: string;
  readonly location: string;
  readonly ownerId: string | Types.ObjectId;
  readonly jobsAnalyzedIds: string[] | Types.ObjectId[];
  readonly technologiesIds: string[] | Types.ObjectId[];
  readonly requireEnglish: boolean;
}
