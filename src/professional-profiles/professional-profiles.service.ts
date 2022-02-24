import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schemas/users.schema';
import { algorithmGeneratePPG } from './algorithm/algorithm.generate-ppg';
import {
  ProfessionalProfile,
  ProfessionalProfileDocument,
} from './schemas/professional-profile.schema';

@Injectable()
export class ProfessionalProfilesService {
  private readonly logger = new Logger(ProfessionalProfilesService.name);

  constructor(
    @InjectModel(ProfessionalProfile.name)
    private readonly proProfileModel: Model<ProfessionalProfileDocument>,
  ) {}

  /**
   * Genera un perfil profesional utilizando un algoritmo que hace Web Scraping.
   * El perfil generado se persiste en la base de datos.
   * @param user - current user
   */
  async generate(
    user: User,
    jobTitle: string,
    location: string,
  ): Promise<ProfessionalProfile> {
    const proProfile = await algorithmGeneratePPG(user, jobTitle, location);
    const createdProProfile = await this.proProfileModel.create(proProfile);
    this.logger.log(`Professional profile created by user ${user._id}`);
    this.logger.debug(`Professional profile generated`, createdProProfile);

    return createdProProfile.populate('owner');
  }

  async get(user: User): Promise<ProfessionalProfile[]> {
    const profiles = await this.proProfileModel
      .find({ owner: user })
      .populate('owner')
      .exec();

    return profiles;
  }

  async remove(user: User, profileId: string) {
    return;
  }
}
