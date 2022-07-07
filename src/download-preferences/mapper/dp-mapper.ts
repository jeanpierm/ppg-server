import { DownloadPreferencesResponse } from '../dto/dp-response.dto';
import { DownloadPreferences } from '../schema/download-preferences.schema';

export class DownloadPreferencesMapper {
  static toResponse(downloadPreferences: DownloadPreferences) {
    return new DownloadPreferencesResponse({
      dpId: downloadPreferences.dpId,
      photo: downloadPreferences.photo,
      biography: downloadPreferences.biography,
      linkedIn: downloadPreferences.linkedIn,
      email: downloadPreferences.email,
      github: downloadPreferences.github,
      portfolio: downloadPreferences.portfolio,
      userEmail: downloadPreferences.user.email,
    });
  }
}
