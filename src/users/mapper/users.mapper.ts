import { Injectable } from '@nestjs/common';
import { AccountResponse } from 'src/account/dto/account-response.dto';
import { UserResponse } from '../dto/user-response.dto';
import { User } from '../schemas/users.schema';

@Injectable()
export class UsersMapper {
  maptoAccountResponse(user: User): AccountResponse {
    return new AccountResponse({
      userId: user._id,
      name: user.name,
      surname: user.surname,
      email: user.email,
    });
  }

  mapToUserResponse(user: User): UserResponse {
    return new UserResponse({
      userId: user._id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }
}
