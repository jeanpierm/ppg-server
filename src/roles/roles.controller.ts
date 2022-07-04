import { Body, Controller, Get, Param, Patch, Post, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesMapper } from './roles.mapper';
import { RolesService } from './roles.service';

@ApiTags('roles')
@Controller('roles')
@ApiBearerAuth()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  /**
   * Busca roles.
   */
  @ApiOperation({ summary: 'buscar roles' })
  @Get()
  @Roles(Role.Admin)
  async findAll() {
    const roles = await this.rolesService.findAll();
    return roles.map((role) => RolesMapper.toRoleResponse(role));
  }

  /**
   * Busca un rol según el rolId.
   */
  @ApiOperation({ summary: 'buscar rol' })
  @Get(':roleId')
  @Roles(Role.Admin)
  async findOne(
    @Param('roleId') roleId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const role = res.locals.role || (await this.rolesService.findById(roleId));
    return RolesMapper.toRoleResponse(role);
  }

  /**
   * Crea un rol.
   */
  @ApiOperation({ summary: 'crear rol' })
  @Post()
  @Roles(Role.Admin)
  async create(@Body() createRoleDto: CreateRoleDto) {
    const role = await this.rolesService.create(createRoleDto);
    return RolesMapper.toRoleResponse(role);
  }

  /**
   * Actualiza un rol según el rolId.
   */
  @ApiOperation({ summary: 'actualizar rol' })
  @Patch(':roleId')
  @Roles(Role.Admin)
  async update(
    @Param('roleId') roleId: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    const role = await this.rolesService.update(roleId, updateRoleDto);
    return RolesMapper.toRoleResponse(role);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.rolesService.remove(+id);
  // }
}
