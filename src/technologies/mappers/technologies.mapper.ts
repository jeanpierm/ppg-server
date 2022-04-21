import { TechnologyResponse } from '../dto/technology-response.dto';
import { Technology } from '../schemas/technology.schema';

export class TechnologiesMapper {
  static toTechnologyResponse(technology: Technology): TechnologyResponse {
    return new TechnologyResponse({
      technologyId: technology.technologyId,
      type: technology.type,
      name: technology.name,
      identifiers: technology.identifiers,
    });
  }
}
