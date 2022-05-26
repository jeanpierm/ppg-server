import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { genSalt, hash } from 'bcrypt';
import { Model } from 'mongoose';
import { EntityStatus } from '../shared/enums/status.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/users.schema';
import { IsUnregisteredEmailValidator } from './validators/is-unregistered-email.validator';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly isUnregisteredEmail: IsUnregisteredEmailValidator,
  ) {}

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().lean();
  }

  async findById(userId: string): Promise<User> {
    const user = await this.userModel.findOne({ userId }).lean();
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).lean();
    return user;
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
    return newUser.save();
  }

  async updateById(userId: string, updateUser: UpdateUserDto): Promise<User> {
    const userToUpdate = await this.userModel.findOne({ userId });
    const wantUpdateEmail = updateUser.email && userToUpdate.email !== updateUser.email;
    if (wantUpdateEmail) {
      await this.isUnregisteredEmail.validate(updateUser.email);
    }

    return this.userModel.findOneAndUpdate({ userId }, updateUser, { new: true }).lean();
  }

  async removeById(userId: string): Promise<void> {
    await this.userModel.findOneAndUpdate(
      { userId },
      {
        status: EntityStatus.Inactive,
      },
    );
  }

  async activeById(userId: string): Promise<void> {
    await this.userModel.findOneAndUpdate(
      { userId },
      {
        status: EntityStatus.Active,
      },
    );
  }

  async updatePasswordByEmail(email: string, password: string): Promise<void> {
    const passwordSalt = await genSalt();
    const passwordHash = await hash(password, passwordSalt);
    await this.userModel.findOneAndUpdate({ email }, { password: passwordHash });
  }
}
