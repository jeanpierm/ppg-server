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
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { ParseObjectIdPipe } from '../core/pipes/parse-objectid.pipe';
import { PaginatedResponseDto } from '../shared/dto/paginated-response.dto';
import { PaginationQuery } from '../shared/dto/pagination-query.dto';
import { CreateTechTypeDto } from './dto/create-tech-type.dto';
import { GetTechTypeQuery } from './dto/get-tech-type-query';
import { TechTypeResponseDto } from './dto/tech-type-response.dto';
import { UpdateTechTypeDto } from './dto/update-tech-type.dto';
import { TechTypesMapper } from './tech-types.mapper';
import { TechTypesService } from './tech-types.service';

@ApiTags('technology-types')
@Controller('tech-types')
@ApiBearerAuth()
export class TechTypesController {
  constructor(private readonly techTypesService: TechTypesService) {}

  /**
   * Obtener tipos de tecnologías, las cuales están relacionadas a las tecnologías que se usan para el algoritmo PPG.
   */
  @ApiOperation({ summary: 'obtener tipos de tecnologías' })
  @Roles(Role.Admin, Role.User)
  @Get()
  async findAll(
    @Query() paginationParams: PaginationQuery & GetTechTypeQuery,
  ): Promise<PaginatedResponseDto<TechTypeResponseDto>> {
    const techTypesPaginated = await this.techTypesService.findPaginated(
      paginationParams,
    );
    const data = techTypesPaginated.data.map((type) =>
      TechTypesMapper.toResponse(type),
    );

    return { ...techTypesPaginated, data };
  }

  /**
   * Obtener tipo de tecnología por ID.
   */
  @ApiOperation({ summary: 'obtener tipo de tecnología' })
  @Roles(Role.Admin, Role.User)
  @Get(':id')
  async findOne(
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<TechTypeResponseDto> {
    const type = await this.techTypesService.findById(id);
    return TechTypesMapper.toResponse(type);
  }

  /**
   * Crea un tipo de tecnología.
   */
  @ApiOperation({ summary: 'crear tipo de tecnología' })
  @Roles(Role.Admin)
  @Post()
  async create(
    @Body() createTechTypeDto: CreateTechTypeDto,
  ): Promise<TechTypeResponseDto> {
    const createdType = await this.techTypesService.create(createTechTypeDto);
    return TechTypesMapper.toResponse(createdType);
  }

  /**
   * Actualiza un tipo de tecnología por ID.
   */
  @ApiOperation({ summary: 'actualizar tipo de tecnología' })
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id')
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateTechTypeDto: UpdateTechTypeDto,
  ): Promise<void> {
    await this.techTypesService.update(id, updateTechTypeDto);
  }

  /**
   * Elimina un tipo de tecnología por ID.
   */
  @ApiOperation({ summary: 'eliminar tipo de tecnología' })
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id', ParseObjectIdPipe) id: string): Promise<void> {
    await this.techTypesService.removeById(id);
  }
}
