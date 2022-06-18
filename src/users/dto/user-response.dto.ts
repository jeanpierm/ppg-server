import { RoleResponseDto } from '../../roles/dto/role-response.dto';
import { EntityStatus } from '../../shared/enums/status.enum';
import { UserIntf } from '../interfaces/user.interface';

export class UserResponse implements UserIntf {
  readonly userId: string;

  readonly email: string;

  readonly name: string;

  readonly surname: string;

  readonly linkedIn?: string;

  readonly biography?: string;

  readonly location: string;

  readonly jobTitle: string;

  readonly role: RoleResponseDto;

  readonly status: EntityStatus;

  readonly createdAt: Date;

  readonly updatedAt: Date;

  constructor(dto: UserResponse) {
    Object.assign(this, dto);
  }
}
