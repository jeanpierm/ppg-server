import { EntityStatus } from '../../shared/enums/status.enum';

export class UserResponse {
  readonly userId: string;

  readonly email: string;

  readonly name: string;

  readonly surname: string;

  readonly createdAt: Date;

  readonly updatedAt: Date;

  readonly status: EntityStatus;

  constructor(partial: Partial<UserResponse>) {
    Object.assign(this, partial);
  }
}
