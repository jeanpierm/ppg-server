import {
  ArrayMinSize,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Role } from 'src/auth/enums/role.enum';
import { IsUnregisteredEmail } from '../validators/is-unregistered-email.validator';

const formatter = new (Intl as any).ListFormat('en', {
  style: 'short',
  type: 'disjunction',
});

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
  @ArrayMinSize(1)
  @IsEnum(Role, {
    each: true,
    message: `each value in roles must be ${formatter.format(Object.values(Role))}`,
  })
  readonly roles: Role[];
}
