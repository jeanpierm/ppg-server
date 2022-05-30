import { Body, Controller, Get, Param, Patch, Post, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../auth/enums/role.enum';
import { CreateRoleDto } from './dto/create-role.dto';
import { Option } from './dto/option.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
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
  findAll() {
    return this.rolesService.findAll();
  }

  /**
   * Busca un rol según el rolId.
   */
  @ApiOperation({ summary: 'buscar rol' })
  @Get(':roleId')
  @Roles(Role.Admin)
  findOne(
    @Param('roleId') roleId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { role } = res.locals;
    if (role) {
      return role;
    }
    return this.rolesService.findById(roleId);
  }

  /**
   * Crea un rol.
   */
  @ApiOperation({ summary: 'crear rol' })
  @Post()
  @Roles(Role.Admin)
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  /**
   * Actualiza un rol según el rolId.
   */
  @ApiOperation({ summary: 'actualizar rol' })
  @Patch(':roleId')
  @Roles(Role.Admin)
  update(
    @Param('roleId') roleId: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.rolesService.update(roleId, updateRoleDto);
  }

  /**
   * Añade una opción a un rol según el rolId.
   */
  @ApiOperation({ summary: 'actualizar rol' })
  @Post(':roleId/options')
  @Roles(Role.Admin)
  pushOption(@Param('roleId') roleId: string, @Body() option: Option) {
    return this.rolesService.pushOptionToRole(roleId, option);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.rolesService.remove(+id);
  // }
}
