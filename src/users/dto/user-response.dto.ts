import { RoleEntity } from '../../roles/schemas/role.schema';
import { EntityStatus } from '../../shared/enums/status.enum';
import { UserInf } from '../interfaces/user.interface';

export class UserResponse implements UserInf {
  readonly userId: string;

  readonly email: string;

  readonly name: string;

  readonly surname: string;

  readonly roles: RoleEntity[];

  readonly status: EntityStatus;

  readonly createdAt: Date;

  readonly updatedAt: Date;

  constructor(dto: UserResponse) {
    Object.assign(this, dto);
  }
}
