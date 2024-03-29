import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { ApiResponse } from 'src/shared/dto/api-response.dto';
import { PaginationQuery } from 'src/shared/dto/pagination-query.dto';
import {
  ApiCreatedCustomResponse,
  ApiOkCustomResponse,
  ApiPaginatedResponse,
} from '../shared/decorators/api-response.decorator';
import { PaginatedResponseDto } from '../shared/dto/paginated-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserParams } from './dto/find-user-params.dto';
import { FindUsersQuery } from './dto/find-users-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponse } from './dto/user-response.dto';
import { UsersMapper } from './mapper/users.mapper';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Busca usuarios.
   */
  @ApiOperation({ summary: 'buscar usuarios' })
  @ApiPaginatedResponse(UserResponse)
  @Get()
  @Roles(Role.Admin)
  async findAll(
    @Query() params: PaginationQuery & FindUsersQuery,
  ): Promise<PaginatedResponseDto<UserResponse>> {
    const usersPagination = await this.usersService.findPaginated(params);
    const payload: PaginatedResponseDto<UserResponse> = {
      ...usersPagination,
      data: usersPagination.data.map((user) =>
        UsersMapper.toUserResponse(user),
      ),
    };

    return payload;
  }

  /**
   * Busca un usuario según el userId.
   */
  @ApiOperation({ summary: 'buscar usuario' })
  @ApiOkCustomResponse(UserResponse)
  @Get(':userId')
  @Roles(Role.Admin)
  async findOne(
    @Param() { userId }: FindUserParams,
  ): Promise<ApiResponse<UserResponse>> {
    const user = await this.usersService.findById(userId);
    const payload = UsersMapper.toUserResponse(user);
    return new ApiResponse('User obtained successfully', payload);
  }

  /**
   * Crea un usuario.
   */
  @ApiOperation({ summary: 'crear usuario' })
  @ApiCreatedCustomResponse(UserResponse)
  @Post()
  @Roles(Role.Admin)
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ApiResponse<UserResponse>> {
    const user = await this.usersService.create(createUserDto);
    const payload = UsersMapper.toUserResponse(user);
    return new ApiResponse('User created successfully', payload);
  }

  /**
   * Actualiza un usuario según el userId.
   */
  @ApiOperation({ summary: 'actualizar usuario' })
  @ApiOkCustomResponse(UserResponse)
  @Patch(':userId')
  @Roles(Role.Admin)
  async update(
    @Param() { userId }: FindUserParams,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ApiResponse<UserResponse>> {
    const user = await this.usersService.updateById(userId, updateUserDto);
    const payload = UsersMapper.toUserResponse(user);
    return new ApiResponse('User updated successfully', payload);
  }

  /**
   * Elimina de manera lógica (inactiva) un usuario según el userId.
   */
  @ApiOperation({ summary: 'eliminar usuario' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':userId')
  @Roles(Role.Admin)
  async remove(@Param() { userId }: FindUserParams): Promise<void> {
    await this.usersService.removeById(userId);
  }

  /**
   * Activa un usuario que previamente ha sido inactivado según el userId.
   */
  @ApiOperation({ summary: 'activar usuario' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(':userId')
  async active(@Param() { userId }: FindUserParams): Promise<void> {
    await this.usersService.activeById(userId);
  }
}
