import { TechTypeResponseDto } from '../../tech-types/dto/tech-type-response.dto';

export class TechnologyResponse {
  readonly technologyId: string;
  readonly type: TechTypeResponseDto;
  readonly name: string;
  readonly identifiers: string[];

  constructor(dto: TechnologyResponse) {
    Object.assign(this, dto);
  }
}
