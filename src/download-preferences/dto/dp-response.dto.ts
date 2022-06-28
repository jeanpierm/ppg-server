export class DownloadPreferencesResponse {
  readonly dpId: string;
  readonly photo: boolean;
  readonly biography: boolean;
  readonly linkedIn: boolean;
  readonly email: boolean;
  readonly userEmail: string;

  constructor(dto: DownloadPreferencesResponse) {
    Object.assign(this, dto);
  }
}
