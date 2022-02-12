import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { genSalt, hash } from 'bcrypt';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EntityStatus } from '../shared/enums/status.enum';
import { User, UserDocument } from './schemas/users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async existsByEmail(email: string): Promise<boolean> {
    return this.userModel.exists({ email });
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    return user.toObject();
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    return user.toObject();
  }

  async create(user: CreateUserDto): Promise<User> {
    const { email, password, name, surname } = user;
    const passwordSalt = await genSalt();
    const passwordHash = await hash(password, passwordSalt);
    const newUser = new this.userModel({
      email,
      password: passwordHash,
      name,
      surname,
    });
    return (await newUser.save()).toObject();
  }

  async updateById(id: string, updateUser: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      {
        name: updateUser.name,
        surname: updateUser.surname,
        email: updateUser.email,
      },
      { new: true },
    );
    return updatedUser.toObject();
  }

  async removeById(id: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, {
      status: EntityStatus.INACTIVE,
    });
  }

  async activeById(id: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, { status: EntityStatus.ACTIVE });
  }

  async updatePasswordByEmail(email: string, password: string): Promise<void> {
    const passwordSalt = await genSalt();
    const passwordHash = await hash(password, passwordSalt);
    await this.userModel.findOneAndUpdate(
      { email },
      { password: passwordHash },
    );
  }
}
