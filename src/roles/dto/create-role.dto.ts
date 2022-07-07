import { IsEnum } from 'class-validator';
import { Role } from '../../auth/enums/role.enum';

export class CreateRoleDto {
  @IsEnum(Role)
  readonly name: Role;
}
