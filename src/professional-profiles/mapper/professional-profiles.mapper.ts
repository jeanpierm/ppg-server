import { TechnologiesMapper } from '../../technologies/mappers/technologies.mapper';
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
      technologies: proProfile.technologies.map((tech) =>
        TechnologiesMapper.toTechnologyResponse(tech),
      ),
      requireEnglish: proProfile.requireEnglish,
      jobsAnalyzed: proProfile.jobsAnalyzed.map((job) =>
        JobsMapper.toResponse(job),
      ),
      createdAt: proProfile.createdAt.toISOString(),
      updatedAt: proProfile.updatedAt.toISOString(),
    });
  }
}
