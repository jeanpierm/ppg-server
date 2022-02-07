export class AccountResponse {
  readonly userId: string;

  readonly email: string;

  readonly name: string;

  readonly surname: string;

  constructor(partial: Partial<AccountResponse>) {
    Object.assign(this, partial);
  }
}
