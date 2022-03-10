import { Injectable } from '@nestjs/common';
import { TechnologyResponseDto } from '../dto/technology-response.dto';
import { Technology } from '../schemas/technology.schema';

@Injectable()
export class TechnologiesMapper {
  mapToResponse(technology: Technology): TechnologyResponseDto {
    return new TechnologyResponseDto({
      technologyId: technology.technologyId,
      type: technology.type,
      dictionary: technology.dictionary,
    });
  }
}
