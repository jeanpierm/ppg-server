import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { genSalt, hash } from 'bcrypt';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserStatus } from './enums/user-status.enum';
import { User, UserDocument } from './schemas/users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async existsByEmail(email: string): Promise<boolean> {
    return this.userModel.exists({ email });
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    return user?.toObject();
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

  async update(email: string, updateUser: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel.findOneAndUpdate(
      { email },
      {
        name: updateUser.name,
        surname: updateUser.surname,
        email: updateUser.email,
      },
      { new: true },
    );
    return updatedUser.toObject();
  }

  async remove(email: string): Promise<void> {
    await this.userModel.findOneAndUpdate(
      { email },
      { status: UserStatus.INACTIVE },
    );
  }

  async active(email: string): Promise<void> {
    await this.userModel.findOneAndUpdate(
      { email },
      { status: UserStatus.ACTIVE },
    );
  }

  async updatePassword(email: string, password: string): Promise<void> {
    const passwordSalt = await genSalt();
    const passwordHash = await hash(password, passwordSalt);
    await this.userModel.findOneAndUpdate(
      { email },
      { password: passwordHash },
    );
  }
}
