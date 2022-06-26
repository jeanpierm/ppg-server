import { Company } from '../dto/company.dto';
import { WorkPlace } from '../types/workplace.type';

export interface JobIntf {
  title: string;

  detail: string;

  company: Company;

  location: string;

  workplaceType?: WorkPlace;

  url: string;
}
