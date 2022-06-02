import { AccountResponse } from 'src/account/dto/account-response.dto';
import { RolesMapper } from '../../roles/roles.mapper';
import { UserResponse } from '../dto/user-response.dto';
import { User } from '../schemas/user.schema';

export class UsersMapper {
  static toAccountResponse({
    userId,
    name,
    surname,
    email,
    role,
  }: User): AccountResponse {
    return new AccountResponse({
      userId,
      name,
      surname,
      email,
      options: role.options,
    });
  }

  static toUserResponse({
    userId,
    name,
    surname,
    email,
    role,
    status,
    createdAt,
    updatedAt,
  }: User): UserResponse {
    return new UserResponse({
      userId,
      name,
      surname,
      email,
      role: RolesMapper.toRoleResponse(role),
      status,
      createdAt,
      updatedAt,
    });
  }
}
