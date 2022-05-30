import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { genSalt, hash } from 'bcrypt';
import { Model } from 'mongoose';
import { PaginationParams } from 'src/shared/dto/pagination-params.dto';
import { Role } from '../auth/enums/role.enum';
import { RolesService } from '../roles/roles.service';
import { RoleDocument } from '../roles/schemas/role.schema';
import { PaginationDto } from '../shared/dto/pagination.dto';
import { EntityStatus } from '../shared/enums/status.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { IsUnregisteredEmailValidator } from './validators/is-unregistered-email.validator';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly rolesService: RolesService,
    private readonly isUnregisteredEmail: IsUnregisteredEmailValidator,
  ) {}

  async findAll(pagination: PaginationParams): Promise<PaginationDto<User>> {
    const { size, search, page } = pagination;
    const filterQuery: Record<string, any> = {};
    if (search) {
      filterQuery['$or'] = [
        { name: new RegExp(search, 'i') },
        { surname: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
      ];
    }

    const users = await this.userModel
      .find(filterQuery)
      .sort({ _id: 1 })
      .skip((page - 1) * size)
      .limit(size)
      .populate('roles')
      .lean();

    const totalItems = await this.userModel.count(filterQuery);
    const totalPages = Math.ceil(totalItems / size);

    return {
      totalItems,
      currentPage: page,
      pageSize: size,
      data: users,
      totalPages,
    };
  }

  async findById(userId: string): Promise<User> {
    const user = await this.userModel
      .findOne({ userId })
      .populate('roles')
      .lean();

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).lean();
    return user;
  }

  async create(user: CreateUserDto): Promise<User> {
    const { email, password, name, surname, roles: roleNames } = user;
    const passwordSalt = await genSalt();
    const passwordHash = await hash(password, passwordSalt);
    const roles: RoleDocument[] = roleNames?.length
      ? await Promise.all(
          roleNames.map(async (roleName) => {
            const role = await this.rolesService.findByName(roleName);
            if (!role) {
              throw new NotFoundException(
                `Role with name '${roleName}' does not exist.`,
              );
            }

            return role;
          }),
        )
      : [await this.rolesService.findByName(Role.User)];

    const newUser = new this.userModel({
      email,
      password: passwordHash,
      name,
      surname,
      roles,
    });

    return (await newUser.save()).populate('roles');
  }

  async updateById(userId: string, updateUser: UpdateUserDto): Promise<User> {
    const userToUpdate = await this.userModel.findOne({ userId });
    const wantUpdateEmail =
      updateUser.email && userToUpdate.email !== updateUser.email;
    if (wantUpdateEmail) {
      await this.isUnregisteredEmail.validate(updateUser.email);
    }

    const roles: RoleDocument[] =
      updateUser.roles?.length &&
      (await Promise.all(
        updateUser.roles.map(async (roleName) => {
          const role = await this.rolesService.findByName(roleName);
          if (!role) {
            throw new NotFoundException(
              `Role with name '${roleName}' does not exist.`,
            );
          }

          return role;
        }),
      ));

    return this.userModel
      .findOneAndUpdate({ userId }, { ...updateUser, roles }, { new: true })
      .lean();
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
    await this.userModel.findOneAndUpdate(
      { email },
      { password: passwordHash },
    );
  }
}
