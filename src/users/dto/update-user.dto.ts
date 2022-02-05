import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import {
  STATUS_VALIDATION_MESSAGE,
  UserStatus,
} from '../enums/user-status.enum';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsEnum(UserStatus, { message: STATUS_VALIDATION_MESSAGE })
  readonly status: UserStatus;
}
