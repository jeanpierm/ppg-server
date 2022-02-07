import { Injectable } from '@nestjs/common';
import { ProfesionalProfile } from '../schemas/profesional-profile.schema';

@Injectable()
export class ProfesionalProfilesMapper {
  mapToProfesionalProfileResponse(proProfile: ProfesionalProfile): any {
    return {
      languages: proProfile.languages,
      owner: {
        name: proProfile.owner.name,
        surname: proProfile.owner.surname,
        email: proProfile.owner.email,
      },
    };
  }
}
