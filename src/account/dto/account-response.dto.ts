import { Option } from '../../roles/dto/option.dto';

export class AccountResponse {
  readonly userId: string;

  readonly email: string;

  readonly name: string;

  readonly surname: string;

  readonly location: string;

  readonly jobTitle: string;

  readonly linkedIn?: string;

  readonly biography?: string;

  readonly github?: string;

  readonly portfolio?: string;

  readonly options: Option[];

  constructor(partial: AccountResponse) {
    Object.assign(this, partial);
  }
}
