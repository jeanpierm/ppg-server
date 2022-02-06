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
import { User } from './schemas/users.schema';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ApiResponse<User>> {
    const user = await this.usersService.create(createUserDto);
    return new ApiResponse('User created successfully', user);
  }

  @Get()
  async findAll(): Promise<ApiResponse<User[]>> {
    const users = await this.usersService.findAll();
    return new ApiResponse('Users obtained successfully', users);
  }

  @Get(':email')
  async findOne(
    @Param() { email }: FindUserParams,
  ): Promise<ApiResponse<User>> {
    const user = await this.usersService.findByEmail(email);
    return new ApiResponse('User obtained successfully', user);
  }

  @Patch(':email')
  async update(
    @Param() { email }: FindUserParams,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.update(email, updateUserDto);
    return new ApiResponse('User updated successfully', user);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':email')
  async remove(@Param() { email }: FindUserParams): Promise<void> {
    await this.usersService.remove(email);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(':email')
  async active(@Param() { email }: FindUserParams): Promise<void> {
    await this.usersService.active(email);
  }
}
