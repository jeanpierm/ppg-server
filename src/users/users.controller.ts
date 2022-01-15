import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from './schemas/users.schema';
import { Response } from 'src/shared/dto/response.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<Response<User>> {
    const user = await this.userService.createUser(createUserDto);

    return {
      message: 'User created successfully',
      data: user,
    };
  }

  @Get()
  async findAll(): Promise<Response<User[]>> {
    const users = await this.userService.getUsers();

    return {
      message: 'Users obtained successfully',
      data: users,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string): string {
    return `This action returns a #${id} user`;
  }

  /*  @Put(':id')
    update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
        return `This action updates a #${id} user`;
    } */

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} user`;
  }
}
