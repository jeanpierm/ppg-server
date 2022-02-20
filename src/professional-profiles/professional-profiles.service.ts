import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schemas/users.schema';
import { generateProfesionalProfile } from './algorithm/generate-professional-profile';
import {
  ProfessionalProfile,
  ProfessionalProfileDocument,
} from './schemas/professional-profile.schema';

@Injectable()
export class ProfesionalProfilesService {
  constructor(
    @InjectModel(ProfessionalProfile.name)
    private readonly proProfileModel: Model<ProfessionalProfileDocument>,
  ) {}

  // TODO
  /**
   * Genera un perfil profesional utilizando un algoritmo que hace Web Scraping.
   * El perfil generado se persiste en la base de datos.
   * @param user - current user
   */
  async generate(user: User) {
    const proProfile = await generateProfesionalProfile();
    const createdProProfile = await this.proProfileModel.create(proProfile);

    return createdProProfile;
  }

  async get(user: User): Promise<ProfessionalProfile[]> {
    const profiles = await this.proProfileModel.find({ owner: user }).exec();

    return profiles;
  }

  async remove(user: User, profileId: string) {
    return;
  }
}
