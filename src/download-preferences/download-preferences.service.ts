import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ProfessionalProfile,
  ProfessionalProfileDocument,
} from 'src/professional-profiles/schemas/professional-profile.schema';
import { UserDocument } from 'src/users/schemas/user.schema';
import { UpdateDpDto } from './dto/update-dp.dto';
import {
  DownloadPreferences,
  DownloadPreferencesDocument,
} from './schema/download-preferences.schema';

@Injectable()
export class DownloadPreferencesService {
  private readonly logger = new Logger(DownloadPreferencesService.name);

  constructor(
    @InjectModel(DownloadPreferences.name)
    private readonly downloadPreferencesModel: Model<DownloadPreferencesDocument>,
    @InjectModel(ProfessionalProfile.name)
    private readonly proProfileModel: Model<ProfessionalProfileDocument>,
  ) {}

  async getDownloadPreferences(
    user: UserDocument,
  ): Promise<DownloadPreferences> {
    const downloadPreferences = await this.downloadPreferencesModel
      .findOne({ user: user._id })
      .populate('user')
      .lean();
    if (!downloadPreferences) {
      await this.downloadPreferencesModel.create({ user: user._id });

      return await this.downloadPreferencesModel
        .findOne({ user: user._id })
        .populate('user')
        .lean();
    }

    return downloadPreferences;
  }

  async updateDownloadPreferences(
    user: UserDocument,
    dpId: string,
    updateDp: UpdateDpDto,
  ): Promise<DownloadPreferences> {
    return await this.downloadPreferencesModel
      .findOneAndUpdate({ user: user._id, dpId: dpId }, updateDp, {
        new: true,
      })
      .populate('user')
      .lean();
  }
}
