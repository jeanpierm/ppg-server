import { UserStatus } from '../enums/user-status.enum';

export class UserResponse {
  readonly userId: string;

  readonly email: string;

  readonly name: string;

  readonly surname: string;

  readonly createdAt: Date;

  readonly updatedAt: Date;

  readonly status: UserStatus;

  constructor(partial: Partial<UserResponse>) {
    Object.assign(this, partial);
  }
}
