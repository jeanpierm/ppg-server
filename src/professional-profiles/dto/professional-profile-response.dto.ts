import { TechnologyResponse } from '../../technologies/dto/technology-response.dto';
import { JobResponse } from './job-response.dto';

export class ProfessionalProfileResponse {
  readonly ppId: string;
  readonly jobTitle: string;
  readonly location: string;
  readonly technologies: TechnologyResponse[];
  readonly requireEnglish: boolean;
  readonly jobsAnalyzed: JobResponse[];
  readonly createdAt: string;
  readonly updatedAt: string;

  constructor(object: ProfessionalProfileResponse) {
    Object.assign(this, object);
  }
}
