import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { genSalt, hash } from 'bcrypt';
import { Model } from 'mongoose';
import { PaginationParams } from 'src/shared/dto/pagination-params.dto';
import { Role } from '../auth/enums/role.enum';
import { RolesService } from '../roles/roles.service';
import { RoleDocument } from '../roles/schemas/role.schema';
import { EntityStatus } from '../shared/enums/status.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import {
  DownloadPreferences,
  DownloadPreferencesDocument,
} from '../download-preferences/schema/download-preferences.schema';
import { IsUnregisteredEmailValidator } from './validators/is-unregistered-email.validator';
import { PaginatedResponseDto } from '../shared/dto/paginated-response.dto';
import { FindUsersQueryParams } from './dto/find-users-query-params.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(DownloadPreferences.name)
    private readonly downloadPreferencesModel: Model<DownloadPreferencesDocument>,
    private readonly rolesService: RolesService,
    private readonly isUnregisteredEmail: IsUnregisteredEmailValidator,
  ) {}

  async findAll(
    params: PaginationParams & FindUsersQueryParams,
  ): Promise<PaginatedResponseDto<User>> {
    const { size, search, page, status } = params;
    const filterQuery: Record<string, any> = {};
    if (search) {
      filterQuery['$or'] = [
        { name: new RegExp(search, 'i') },
        { surname: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
      ];
    }
    if (status) filterQuery.status = status;

    const users = await this.userModel
      .find(filterQuery)
      .sort({ _id: 1 })
      .skip((page - 1) * size)
      .limit(size)
      .populate('role')
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
      .populate('role')
      .lean();

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel
      .findOne({ email })
      .orFail(new NotFoundException(`User with email "${email}" not found`))
      .populate('role')
      .lean();

    return user;
  }

  async create(user: CreateUserDto): Promise<User> {
    const { password, role: roleName } = user;
    const passwordSalt = await genSalt();
    const passwordHash = await hash(password, passwordSalt);
    const role: RoleDocument = roleName
      ? await this.rolesService.findByName(roleName)
      : await this.rolesService.findByName(Role.User);

    const newUser = await this.userModel.create({
      ...user,
      role,
      password: passwordHash,
    });

    //Create download preferences
    await this.downloadPreferencesModel.create({ user: newUser });
    return newUser.populate('role');
  }

  async updateById(userId: string, updateUser: UpdateUserDto): Promise<User> {
    const userToUpdate = await this.userModel
      .findOne({ userId })
      .orFail(new NotFoundException(`User with ID ${userId} not found.`));
    const wantUpdateEmail =
      updateUser.email && userToUpdate.email !== updateUser.email;
    if (wantUpdateEmail) {
      await this.isUnregisteredEmail.validate(updateUser.email);
    }
    const role: RoleDocument =
      updateUser.role && (await this.rolesService.findByName(updateUser.role));
    const password: string =
      updateUser.password && (await hash(updateUser.password, 10));

    return this.userModel
      .findOneAndUpdate(
        { userId },
        { ...updateUser, role, password },
        { new: true },
      )
      .populate('role')
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
    await this.userModel.updateOne(
      { userId },
      {
        status: EntityStatus.Active,
      },
    );
  }

  async updatePasswordByEmail(email: string, password: string): Promise<void> {
    const passwordSalt = await genSalt();
    const passwordHash = await hash(password, passwordSalt);
    await this.userModel.updateOne({ email }, { password: passwordHash });
  }

  async findAndUpdatePasswordById(id: string, password: string) {
    const passwordSalt = await genSalt();
    const passwordHash = await hash(password, passwordSalt);
    return this.userModel
      .findByIdAndUpdate(id, { password: passwordHash }, { new: true })
      .orFail(new NotFoundException(`User with ID "${id}" not found`))
      .lean();
  }
}
