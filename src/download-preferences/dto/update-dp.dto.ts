import { IsNotEmpty } from 'class-validator';
import { DownloadPreferencesIntf } from '../interfaces/download-preferences.interface';

export class UpdateDpDto implements DownloadPreferencesIntf {
  @IsNotEmpty()
  photo: boolean;

  @IsNotEmpty()
  biography: boolean;

  @IsNotEmpty()
  email: boolean;

  @IsNotEmpty()
  linkedIn: boolean;
}
