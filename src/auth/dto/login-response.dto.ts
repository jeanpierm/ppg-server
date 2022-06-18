import { AccountResponse } from '../../account/dto/account-response.dto';

export class LoginResponse {
  accessToken: string;
  accountData: AccountResponse;
}
