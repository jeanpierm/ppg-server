import { WorkPlace } from '../types/workplace.type';
import { Company } from './company.dto';

export class JobOffer {
  company: Company;
  location: string;
  workplaceType: WorkPlace;
  url: string;
}
