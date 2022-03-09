import { Injectable } from '@nestjs/common';
import { AccountResponse } from 'src/account/dto/account-response.dto';
import { UserResponse } from '../dto/user-response.dto';
import { User } from '../schemas/users.schema';

@Injectable()
export class UsersMapper {
  mapToAccountResponse(user: User): AccountResponse {
    return new AccountResponse({
      userId: user.userId,
      name: user.name,
      surname: user.surname,
      email: user.email,
    });
  }

  mapToUserResponse(user: User): UserResponse {
    return new UserResponse({
      userId: user.userId,
      name: user.name,
      surname: user.surname,
      email: user.email,
      roles: user.roles,
      status: user.status,
      createdAt: (user as any).createdAt,
      updatedAt: (user as any).updatedAt,
    });
  }
}
