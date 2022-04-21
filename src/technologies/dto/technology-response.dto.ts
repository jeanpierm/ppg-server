import { TechType } from '../../professional-profiles/enums/tech-type.enum';
import { TechnologyIntf } from '../interfaces/technology.interface';

export class TechnologyResponse implements TechnologyIntf {
  readonly technologyId: string;
  readonly type: TechType;
  readonly name: string;
  readonly identifiers: string[];

  constructor(dto: TechnologyResponse) {
    Object.assign(this, dto);
  }
}
