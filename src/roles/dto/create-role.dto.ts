import { Type } from 'class-transformer';
import { IsEnum, ValidateNested } from 'class-validator';
import { Role } from '../../auth/enums/role.enum';
import { Option } from './option.dto';

export class CreateRoleDto {
  @IsEnum(Role)
  readonly name: Role;

  @ValidateNested({ each: true })
  @Type(() => Option)
  options: Option[];
}
