import { UserIntf } from '../../users/interfaces/user.interface';

export class AccountResponse implements UserIntf {
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

  readonly photo?: string;

  readonly roleName: string;

  constructor(partial: AccountResponse) {
    Object.assign(this, partial);
  }
}
