import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { ApiResponse } from 'src/shared/dto/api-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserParams } from './dto/find-user-params.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponse } from './dto/user-response.dto';
import { UsersMapper } from './mapper/users.mapper';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.Admin)
  async create(@Body() createUserDto: CreateUserDto): Promise<ApiResponse<UserResponse>> {
    const user = await this.usersService.create(createUserDto);
    const payload = UsersMapper.toUserResponse(user);
    return new ApiResponse('User created successfully', payload);
  }

  @Get()
  @Roles(Role.Admin)
  async findAll(): Promise<ApiResponse<UserResponse[]>> {
    const users = await this.usersService.findAll();
    const payload = users.map((user) => UsersMapper.toUserResponse(user));
    return new ApiResponse('Users obtained successfully', payload);
  }

  @Get(':userId')
  @Roles(Role.Admin)
  async findOne(@Param() { userId }: FindUserParams): Promise<ApiResponse<UserResponse>> {
    const user = await this.usersService.findById(userId);
    const payload = UsersMapper.toUserResponse(user);
    return new ApiResponse('User obtained successfully', payload);
  }

  @Patch(':userId')
  @Roles(Role.Admin)
  async update(
    @Param() { userId }: FindUserParams,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ApiResponse<UserResponse>> {
    const user = await this.usersService.updateById(userId, updateUserDto);
    const payload = UsersMapper.toUserResponse(user);
    return new ApiResponse('User updated successfully', payload);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':userId')
  @Roles(Role.Admin)
  async remove(@Param() { userId }: FindUserParams): Promise<void> {
    await this.usersService.removeById(userId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(':userId')
  async active(@Param() { userId }: FindUserParams): Promise<void> {
    await this.usersService.activeById(userId);
  }
}
