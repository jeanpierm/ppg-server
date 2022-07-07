import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleDocument, RoleEntity } from './schemas/role.schema';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(RoleEntity.name)
    private readonly roleModel: Model<RoleDocument>,
  ) {}

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

  create(createRoleDto: CreateRoleDto) {
    return this.roleModel.create(createRoleDto);
  }

  update(roleId: string, updateRoleDto: UpdateRoleDto) {
    return this.roleModel.findOneAndUpdate({ roleId }, updateRoleDto, {
      new: true,
    });
  }
}
