import { Role } from '../../auth/enums/role.enum';
export class RoleResponseDto {
  roleId: string;
  name: Role;
  createdAt: Date;
  updatedAt: Date;

  constructor(o: RoleResponseDto) {
    Object.assign(this, o);
  }
}
