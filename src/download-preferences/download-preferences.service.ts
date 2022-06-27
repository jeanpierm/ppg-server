import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';
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
    this.logger.log(`Professional profiles obtained by user ${user.userId}`);

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
