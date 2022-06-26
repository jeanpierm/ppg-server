import { JobOffer } from './job-offer.dto';

export class ProfessionalProfileResponse {
  readonly ppId: string;

  readonly jobTitle: string;

  readonly location: string;

  readonly languages: string[];

  readonly frameworks: string[];

  readonly databases: string[];

  readonly patterns: string[];

  readonly tools: string[];

  readonly paradigms: string[];

  readonly requireEnglish: boolean;

  // TODO
  readonly jobOffersAnalyzed?: JobOffer[];

  readonly createdAt: Date;

  readonly updatedAt: Date;

  constructor(object: ProfessionalProfileResponse) {
    Object.assign(this, object);
  }
}
