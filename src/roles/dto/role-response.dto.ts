import { Role } from '../../auth/enums/role.enum';
import { Option } from './option.dto';

export class RoleResponseDto {
  roleId: string;
  name: Role;
  options: Option[];
  createdAt: Date;
  updatedAt: Date;

  constructor(o: RoleResponseDto) {
    Object.assign(this, o);
  }
}
