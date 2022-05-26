import { Role } from 'src/auth/enums/role.enum';
import { EntityStatus } from 'src/shared/enums/status.enum';

export interface UserInf {
  name: string;
  surname: string;
  email: string;
  roles: Role[];
  status: EntityStatus;
}
