import { TechType } from '../../professional-profiles/enums/tech-type.enum';

export interface TechnologyIntf {
  type: TechType;
  name: string;
  identifiers: string[];
}
