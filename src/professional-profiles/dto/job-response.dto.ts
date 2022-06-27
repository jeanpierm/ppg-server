import { WorkPlace } from '../types/workplace.type';
import { Company } from './company.dto';

export class JobResponse {
  jobId: string;

  title: string;

  company: Company;

  location: string;

  workplaceType?: WorkPlace;

  url: string;
}
