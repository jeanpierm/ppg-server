import { Injectable } from '@nestjs/common';
import {Model} from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {CreateUserDto} from './dto/users-create.dto';
import { User } from './schemas/users.schema';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>
    ){
    }

    async getUsers(): Promise<User[]>{
       return this.userModel.find().exec();
    }

    async createUser(user: CreateUserDto): Promise<User>{
        const { email, password, name, surname } = user;
        const newUser = new this.userModel({
            email,
            password,
            name,
            surname,
        });
        return newUser.save();
    }


}
