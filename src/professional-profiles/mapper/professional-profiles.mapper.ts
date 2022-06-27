import { ProfessionalProfileResponse } from '../dto/professional-profile-response.dto';
import { ProfessionalProfile } from '../schemas/professional-profile.schema';
import { JobsMapper } from './jobs.mapper';

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
      jobsAnalyzed: proProfile.jobsAnalyzed.map((job) =>
        JobsMapper.toResponse(job),
      ),
      createdAt: (proProfile as any).createdAt,
      updatedAt: (proProfile as any).createdAt,
    });
  }
}
