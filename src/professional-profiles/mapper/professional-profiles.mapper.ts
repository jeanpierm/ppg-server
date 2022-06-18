import { ProfessionalProfileResponse } from '../dto/professional-profile-response.dto';
import { ProfessionalProfile } from '../schemas/professional-profile.schema';

export class ProfessionalProfilesMapper {
  static toResponse(
    proProfile: ProfessionalProfile,
  ): ProfessionalProfileResponse {
    return new ProfessionalProfileResponse({
      ppId: proProfile.ppId,
      jobTitle: proProfile.jobTitle,
      location: proProfile.location,
      languages: proProfile.languages,
      frameworks: proProfile.frameworks,
      databases: proProfile.databases,
      patterns: proProfile.patterns,
      tools: proProfile.tools,
      paradigms: proProfile.paradigms,
      requireEnglish: proProfile.requireEnglish,
      createdAt: (proProfile as any).createdAt,
      updatedAt: (proProfile as any).createdAt,
    });
  }
}
