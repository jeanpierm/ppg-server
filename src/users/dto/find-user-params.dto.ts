import { IsEmail } from 'class-validator';
import { IsRegisteredEmail } from '../validators/is-registered-email.validator';

export class FindUserParams {
  @IsEmail()
  @IsRegisteredEmail()
  readonly email: string;
}
