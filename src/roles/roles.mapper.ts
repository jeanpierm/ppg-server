import { RoleResponseDto } from './dto/role-response.dto';
import { RoleEntity } from './schemas/role.schema';

export class RolesMapper {
  static toRoleResponse({
    roleId,
    name,
    options,
    createdAt,
    updatedAt,
  }: RoleEntity): RoleResponseDto {
    return new RoleResponseDto({
      roleId,
      name,
      options,
      createdAt,
      updatedAt,
    });
  }
}
