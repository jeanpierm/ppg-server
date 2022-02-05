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
import { Response } from 'src/shared/dto/response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserParams } from './dto/find-user-params.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/users.schema';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<Response<User>> {
    const user = await this.usersService.create(createUserDto);
    return new Response('User created successfully', user);
  }

  @Get()
  async findAll(): Promise<Response<User[]>> {
    const users = await this.usersService.findAll();
    return new Response('Users obtained successfully', users);
  }

  @Get(':email')
  async findOne(@Param() { email }: FindUserParams): Promise<Response<User>> {
    const user = await this.usersService.findByEmail(email);
    return new Response('User obtained successfully', user);
  }

  @Patch(':email')
  async update(
    @Param() { email }: FindUserParams,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.update(email, updateUserDto);
    return new Response('User updated successfully', user);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':email')
  async remove(@Param() { email }: FindUserParams): Promise<void> {
    await this.usersService.remove(email);
  }
}
