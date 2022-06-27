import { IsNotEmpty } from 'class-validator';
import { DownloadPreferencesIntf } from '../interfaces/download-preferences.interface';

export class UpdateDpDto implements DownloadPreferencesIntf {
  @IsNotEmpty()
  photo: Boolean;

  @IsNotEmpty()
  biography: Boolean;

  @IsNotEmpty()
  email: Boolean;

  @IsNotEmpty()
  linkedIn: Boolean;
}
