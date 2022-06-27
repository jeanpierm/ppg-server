import { UserResponse } from 'src/users/dto/user-response.dto';

export class DownloadPreferencesResponse {
  readonly dpId: string;
  readonly photo: Boolean;
  readonly biography: Boolean;
  readonly linkedIn: Boolean;
  readonly email: Boolean;
  readonly userEmail: string;

  constructor(dto: DownloadPreferencesResponse) {
    Object.assign(this, dto);
  }
}
