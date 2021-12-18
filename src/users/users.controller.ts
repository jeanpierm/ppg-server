import { Controller, Post, Get, Put, Delete, Req, Param, Body, Res, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { CreateUserDto } from './dto/users-create.dto';
import { UsersService } from './users.service';
import { User } from './schemas/users.schema';

@Controller('users')
export class UsersController {

    constructor(
        private userService: UsersService
    ){}

    @Post('/create')
    async create(@Body() createUserDto: CreateUserDto, @Res() res){
       const user = await this.userService.createUser(createUserDto);
       return res.status(HttpStatus.OK).json({
            message: 'received',
            data: user
       });
    }

    @Get('')
    async findAll(@Req() request: Request): Promise<User[]> {
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
