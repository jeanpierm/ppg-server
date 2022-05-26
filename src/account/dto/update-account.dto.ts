import { OmitType, PartialType } from '@nestjs/swagger';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

export class UpdateAccountDto extends PartialType(
  OmitType(UpdateUserDto, ['password', 'roles'] as const),
) {}
