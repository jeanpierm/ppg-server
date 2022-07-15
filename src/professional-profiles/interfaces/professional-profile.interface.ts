import { TechnologyIntf } from '../../technologies/interfaces/technology.interface';

export interface ProfessionalProfileIntf {
  jobTitle: string;
  location: string;
  technologies: TechnologyIntf[];
  requireEnglish: boolean;
}
