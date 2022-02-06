import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schemas/users.schema';
import {
  ProProfile,
  ProProfileDocument,
} from './schemas/profesional-profile.schema';

@Injectable()
export class ProfesionalProfilesService {
  constructor(
    @InjectModel(ProProfile.name)
    private readonly proProfileModel: Model<ProProfileDocument>,
  ) {}

  // TODO
  async generate(user: User) {
    const profile: ProProfile = {
      languages: ['Java', 'TypeScript', 'JavaScript', 'PHP'],
      owner: user,
    };
    return this.proProfileModel.create(profile);
  }
}
