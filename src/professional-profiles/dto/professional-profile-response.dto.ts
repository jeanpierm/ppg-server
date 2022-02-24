import { AccountResponse } from 'src/account/dto/account-response.dto';

export class ProfessionalProfileResponse {
  readonly ppId: string;

  readonly jobTitle: string;

  readonly location: string;

  readonly languages: string[];

  readonly frameworks: string[];

  readonly databases: string[];

  readonly patterns: string[];

  readonly tools: string[];

  readonly paradigms: string[];

  readonly requireEnglish: boolean;

  readonly owner: AccountResponse;

  constructor(partial: Partial<ProfessionalProfileResponse>) {
    Object.assign(this, partial);
  }
}
