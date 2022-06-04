import { RoleResponseDto } from '../../roles/dto/role-response.dto';
import { EntityStatus } from '../../shared/enums/status.enum';
import { UserInf } from '../interfaces/user.interface';

export class UserResponse implements UserInf {
  readonly userId: string;

  readonly email: string;

  readonly name: string;

  readonly surname: string;

  readonly linkedIn?: string;

  readonly biography?: string;

  readonly role: RoleResponseDto;

  readonly status: EntityStatus;

  readonly createdAt: Date;

  readonly updatedAt: Date;

  constructor(dto: UserResponse) {
    Object.assign(this, dto);
  }
}
