import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Role } from 'src/auth/enums/role.enum';
import { generateValidationMessageByValues } from '../../shared/util';
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

  @IsOptional()
  @IsString()
  readonly linkedIn?: string;

  @IsOptional()
  @IsString()
  readonly biography?: string;

  @IsOptional()
  @IsEnum(Role, {
    message: generateValidationMessageByValues('role', Object.values(Role)),
  })
  readonly role: Role;
}
