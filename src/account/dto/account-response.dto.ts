export class AccountResponse {
  readonly email: string;

  readonly name: string;

  readonly surname: string;

  constructor(partial: Partial<AccountResponse>) {
    Object.assign(this, partial);
  }
}
