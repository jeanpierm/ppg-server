import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateResetPasswordToken {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}
