import { IsEmail, IsNotEmpty } from 'class-validator';

export class RecoverPassDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
