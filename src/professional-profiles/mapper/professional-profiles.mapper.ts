import { Injectable } from '@nestjs/common';
import { ProfesionalProfileResponse } from '../dto/profesional-profile-response.dto';
import { ProfessionalProfile } from '../schemas/professional-profile.schema';

@Injectable()
export class ProfesionalProfilesMapper {
  mapToProfesionalProfileResponse(
    proProfile: ProfessionalProfile,
  ): ProfesionalProfileResponse {
    return new ProfesionalProfileResponse({
      languages: proProfile.languages,
      frameworks: proProfile.frameworks,
      databases: proProfile.databases,
      patterns: proProfile.patterns,
      tools: proProfile.tools,
      requireEnglish: proProfile.requireEnglish,
      requireTitle: proProfile.requireTitle,
    });
  }
}
