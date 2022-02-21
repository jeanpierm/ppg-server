import { Injectable } from '@nestjs/common';
import { ProfessionalProfileResponse as ProfessionalProfileResponse } from '../dto/professional-profile-response.dto';
import { ProfessionalProfile } from '../schemas/professional-profile.schema';

@Injectable()
export class ProfessionalProfilesMapper {
  mapToProfessionalProfileResponse(
    proProfile: ProfessionalProfile,
  ): ProfessionalProfileResponse {
    return new ProfessionalProfileResponse({
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
