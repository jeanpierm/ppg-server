import { TechType } from '../../professional-profiles/enums/tech-type.enum';
import { TechDictionary } from './tech-dictionary.dto';

export class TechnologyResponseDto {
  readonly technologyId: string;
  readonly type: TechType;
  readonly dictionary: TechDictionary;

  constructor(dto: TechnologyResponseDto) {
    Object.assign(this, dto);
  }
}
