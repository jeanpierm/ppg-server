import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
  ) {}

  async getDownloadPreferences(
    user: UserDocument,
  ): Promise<DownloadPreferences> {
    const downloadPreferences = await this.downloadPreferencesModel
      .findOne({ user: user._id })
      .populate('user')
      .lean();
    if (!downloadPreferences) {
      return (
        await this.downloadPreferencesModel.create({ user: user._id })
      ).populate('user');
    }

    return downloadPreferences;
  }

  async updateDownloadPreferences(
    user: UserDocument,
    updateDp: UpdateDpDto,
  ): Promise<DownloadPreferences> {
    return this.downloadPreferencesModel
      .findOneAndUpdate({ user: user._id }, updateDp, {
        new: true,
      })
      .orFail(() => new NotFoundException())
      .populate('user')
      .lean();
  }
}
