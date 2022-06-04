import { Option } from '../../roles/dto/option.dto';

export class AccountResponse {
  readonly userId: string;

  readonly email: string;

  readonly name: string;

  readonly surname: string;

  readonly linkedIn?: string;

  readonly biography?: string;

  readonly options: Option[];

  constructor(partial: Partial<AccountResponse>) {
    Object.assign(this, partial);
  }
}
