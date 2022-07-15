import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs/promises';
import { Model } from 'mongoose';
import * as path from 'path';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleDocument, RoleEntity } from './schemas/role.schema';

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);
  private readonly rolesJsonPath = path.join(
    process.cwd(),
    'collections',
    'roles.json',
  );

  constructor(
    @InjectModel(RoleEntity.name)
    private readonly roleModel: Model<RoleDocument>,
  ) {
    this.roleModel
      .find()
      .lean()
      .then((roles) => {
        const rolesExists = roles.length > 0;
        if (rolesExists) {
          this.logger.debug(
            'Carga de roles a MongoDB omitida debido a que ya existen roles registrados.',
          );
          return;
        }
        this.insertBaseRoles();
      });
  }

  private async insertBaseRoles() {
    try {
      const rolesJson: string = (
        await fs.readFile(this.rolesJsonPath, 'utf-8')
      ).toString();
      const createRoles = JSON.parse(rolesJson) as CreateRoleDto[];
      await this.roleModel.insertMany(createRoles);
    } catch (err) {
      if (err instanceof Error) {
        this.logger.warn(
          `Ocurrió un error y no se pudo cargar los tipos de tecnologías desde JSON: ${err.message}`,
        );
        console.error(err);
      }
    }
  }

  findAll() {
    return this.roleModel.find();
  }

  findById(roleId: string) {
    return this.roleModel.findOne({ roleId });
  }

  findByName(name: string) {
    return this.roleModel
      .findOne({ name })
      .orFail(
        new NotFoundException(`Role with name '${name}' does not exist.`),
      );
  }

  async create(createRoleDto: CreateRoleDto) {
    const nameAlreadyExists = await this.roleModel.exists({
      name: createRoleDto.name,
    });
    if (nameAlreadyExists)
      throw new ConflictException(
        `Role with name '${createRoleDto.name}' already exists.`,
      );

    return this.roleModel.create(createRoleDto);
  }

  update(roleId: string, updateRoleDto: UpdateRoleDto) {
    return this.roleModel.findOneAndUpdate({ roleId }, updateRoleDto, {
      new: true,
    });
  }
}
