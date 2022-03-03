import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsOptional } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['email'] as const),
) {
  @IsEmail()
  @IsOptional()
  email: string;
}
