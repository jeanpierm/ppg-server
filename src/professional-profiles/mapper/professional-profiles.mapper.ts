import { Injectable } from '@nestjs/common';
import { AccountResponse } from 'src/account/dto/account-response.dto';
import { ProfessionalProfileResponse as ProfessionalProfileResponse } from '../dto/professional-profile-response.dto';
import { ProfessionalProfile } from '../schemas/professional-profile.schema';

@Injectable()
export class ProfessionalProfilesMapper {
  mapToProfessionalProfileResponse(
    proProfile: ProfessionalProfile,
  ): ProfessionalProfileResponse {
    return new ProfessionalProfileResponse({
      ppId: proProfile._id.toString(),
      jobTitle: proProfile.jobTitle,
      location: proProfile.location,
      languages: proProfile.languages,
      frameworks: proProfile.frameworks,
      databases: proProfile.databases,
      patterns: proProfile.patterns,
      tools: proProfile.tools,
      paradigms: proProfile.paradigms,
      requireEnglish: proProfile.requireEnglish,
      owner: new AccountResponse({
        userId: proProfile.owner._id.toString(),
        name: proProfile.owner.name,
        surname: proProfile.owner.surname,
        email: proProfile.owner.email,
      }),
    });
  }
}
