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

@Controller('/api/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res) {
    const user = await this.userService.createUser(createUserDto);

    return res.status(HttpStatus.OK).json({
      message: 'received',
      data: user,
    });
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.getUsers();
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
