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
    linkedIn,
    biography,
    github,
    portfolio,
    location,
    photo,
    jobTitle,
    role,
  }: User): AccountResponse {
    return new AccountResponse({
      userId,
      name,
      surname,
      email,
      linkedIn,
      biography,
      location,
      jobTitle,
      photo,
      github,
      portfolio,
      options: role.options,
    });
  }

  static toUserResponse({
    userId,
    name,
    surname,
    email,
    linkedIn,
    biography,
    location,
    jobTitle,
    role,
    photo,
    status,
    createdAt,
    updatedAt,
  }: User): UserResponse {
    return new UserResponse({
      userId,
      name,
      surname,
      email,
      linkedIn,
      biography,
      photo,
      location,
      jobTitle,
      role: RolesMapper.toRoleResponse(role),
      status,
      createdAt,
      updatedAt,
    });
  }
}
