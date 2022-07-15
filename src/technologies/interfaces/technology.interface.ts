import { TechType } from '../../tech-types/schemas/tech-type.schema';

export interface TechnologyIntf {
  type: TechType;
  name: string;
  identifiers: string[];
}
