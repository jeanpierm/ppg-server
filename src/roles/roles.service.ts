import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRoleDto } from './dto/create-role.dto';
import { Option } from './dto/option.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleDocument, RoleEntity } from './schemas/role.schema';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(RoleEntity.name)
    private readonly roleModel: Model<RoleDocument>,
  ) {}

  async findAll(): Promise<RoleDocument[]> {
    return this.roleModel.find();
  }

  async findById(roleId: string): Promise<RoleDocument> {
    return this.roleModel.findOne({ roleId });
  }

  async findByName(name: string): Promise<RoleDocument> {
    return this.roleModel.findOne({ name });
  }

  async create(createRoleDto: CreateRoleDto): Promise<RoleDocument> {
    return this.roleModel.create(createRoleDto);
  }

  async update(
    roleId: string,
    updateRoleDto: UpdateRoleDto,
  ): Promise<RoleDocument> {
    return this.roleModel.findOneAndUpdate({ roleId }, updateRoleDto, {
      new: true,
    });
  }

  async pushOptionToRole(roleId: string, option: Option) {
    const role = await this.roleModel.findOne({ roleId });
    role.options.push(option);
    return role.save();
  }
  // remove(roleId: string) {
  //   return `This action removes a #${id} role`;
  // }
}
