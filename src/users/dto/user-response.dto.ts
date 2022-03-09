import { Role } from 'src/auth/enums/role.enum';
import { EntityStatus } from '../../shared/enums/status.enum';

export class UserResponse {
  readonly userId: string;

  readonly email: string;

  readonly name: string;

  readonly surname: string;

  readonly roles: Role[];

  readonly status: EntityStatus;

  readonly createdAt: Date;

  readonly updatedAt: Date;

  constructor(partial: Partial<UserResponse>) {
    Object.assign(this, partial);
  }
}
