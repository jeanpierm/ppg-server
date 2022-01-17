import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { EmailIsNotRegistered } from '../validators/email-is-not-registered.validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @EmailIsNotRegistered()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  readonly surname: string;

  //   status: string; // valores por defecto con la opcion "timestamp" del @Schema(), no son necesarios en el createDto
  //   createAt: Date;
}
