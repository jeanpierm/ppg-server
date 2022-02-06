import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsRegisteredEmail } from 'src/users/validators/is-registered-email.validator';

export class LoginRequest {
  @IsEmail()
  @IsRegisteredEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;

  constructor(partial: Partial<LoginRequest>) {
    Object.assign(this, partial);
  }
}
