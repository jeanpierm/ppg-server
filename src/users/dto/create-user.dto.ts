import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { IsUnregisteredEmail } from '../validators/is-unregistered-email.validator';

export class CreateUserDto {
  @IsEmail()
  @IsUnregisteredEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly surname: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 30)
  readonly password: string;

  //   status: string; // valores por defecto con la opcion "timestamp" del @Schema(), no son necesarios en el createDto
  //   createAt: Date;
}
