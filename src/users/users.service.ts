import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { genSalt, hash } from 'bcrypt';
import { Model } from 'mongoose';
import { PaginationQuery } from 'src/shared/dto/pagination-query.dto';
import { Role } from '../auth/enums/role.enum';
import { RolesService } from '../roles/roles.service';
import { RoleDocument, RoleEntity } from '../roles/schemas/role.schema';
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
import { FindUsersQuery } from './dto/find-users-query.dto';
import * as path from 'path';
import * as fs from 'fs-extra';
import { CreateRoleDto } from '../roles/dto/create-role.dto';
@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private readonly rolesJsonPath = path.join(
    process.cwd(),
    'collections',
    'roles.json',
  );
  private readonly usersJsonPath = path.join(
    process.cwd(),
    'collections',
    'users.json',
  );

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(DownloadPreferences.name)
    private readonly downloadPreferencesModel: Model<DownloadPreferencesDocument>,
    @InjectModel(RoleEntity.name)
    private readonly roleModel: Model<RoleDocument>,
    private readonly rolesService: RolesService,
    private readonly isUnregisteredEmail: IsUnregisteredEmailValidator,
  ) {
    this.initDocuments();
  }

  private async initDocuments() {
    try {
      const roles = await this.roleModel.find().lean();
      const users = await this.userModel.find().lean();
      const rolesExists = roles.length > 0;
      const usersExists = users.length > 0;

      if (usersExists) {
        this.logger.debug(
          'Carga de usuarios predeterminados a MongoDB omitida debido a que ya existen usuarios registrados.',
        );
        return;
      }

      if (!rolesExists) {
        await this.insertDefaultRoles();
        this.logger.debug('Roles cargados a MongoDB desde JSON exitosamente');
      }
      if (!usersExists) {
        await this.insertDefaultUsers();
        this.logger.debug(
          'Usuarios cargados a MongoDB desde JSON exitosamente',
        );
      }
    } catch (err) {
      if (err instanceof Error) {
        this.logger.warn(
          `Ocurrió un error y no se pudo cargar los tipos de tecnologías desde JSON: ${err.message}`,
        );
        console.error(err);
      }
    }
  }

  private async insertDefaultUsers() {
    const usersJson: string = (
      await fs.readFile(this.usersJsonPath, 'utf-8')
    ).toString();
    const createUsers = JSON.parse(usersJson) as CreateUserDto[];
    for (const user of createUsers) {
      await this.create(user);
    }
  }

  private async insertDefaultRoles() {
    const rolesJson: string = (
      await fs.readFile(this.rolesJsonPath, 'utf-8')
    ).toString();
    const createRoles = JSON.parse(rolesJson) as CreateRoleDto[];
    await this.roleModel.insertMany(createRoles);
  }

  async findPaginated(
    params: PaginationQuery & FindUsersQuery,
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
