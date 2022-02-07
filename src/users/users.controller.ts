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
import { ApiResponse } from 'src/shared/dto/response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserParams } from './dto/find-user-params.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponse } from './dto/user-response.dto';
import { UsersMapper } from './mapper/users.mapper';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersMapper: UsersMapper,
  ) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ApiResponse<UserResponse>> {
    const user = await this.usersService.create(createUserDto);
    const payload = this.usersMapper.mapToUserResponse(user);
    return new ApiResponse('User created successfully', payload);
  }

  @Get()
  async findAll(): Promise<ApiResponse<UserResponse[]>> {
    const users = await this.usersService.findAll();
    const payload = users.map((user) =>
      this.usersMapper.mapToUserResponse(user),
    );
    return new ApiResponse('Users obtained successfully', payload);
  }

  @Get(':id')
  async findOne(
    @Param() { id }: FindUserParams,
  ): Promise<ApiResponse<UserResponse>> {
    const user = await this.usersService.findById(id);
    const payload = this.usersMapper.mapToUserResponse(user);
    return new ApiResponse('User obtained successfully', payload);
  }

  @Patch(':id')
  async update(
    @Param() { id }: FindUserParams,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ApiResponse<UserResponse>> {
    const user = await this.usersService.updateById(id, updateUserDto);
    const payload = this.usersMapper.mapToUserResponse(user);
    return new ApiResponse('User updated successfully', payload);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param() { id }: FindUserParams): Promise<void> {
    await this.usersService.removeById(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(':id')
  async active(@Param() { id }: FindUserParams): Promise<void> {
    await this.usersService.activeById(id);
  }
}
