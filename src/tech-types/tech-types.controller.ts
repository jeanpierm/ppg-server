import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { TechTypesService } from './tech-types.service';
import { CreateTechTypeDto } from './dto/create-tech-type.dto';
import { UpdateTechTypeDto } from './dto/update-tech-type.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TechType } from './schemas/tech-type.schema';
import { ParseObjectIdPipe } from '../core/pipes/parse-objectid.pipe';
import { TechTypeResponseDto } from './dto/tech-type-response.dto';
import { TechTypesMapper } from './tech-types.mapper';
import { PaginatedResponseDto } from '../shared/dto/paginated-response.dto';
import { PaginationParams } from '../shared/dto/pagination-params.dto';

@ApiTags('technology-types')
@Controller('tech-types')
@ApiBearerAuth()
export class TechTypesController {
  constructor(private readonly techTypesService: TechTypesService) {}

  /**
   * Obtener tipos de tecnologías, las cuales están relacionadas a las tecnologías que se usan para el algoritmo PPG.
   */
  @ApiOperation({ summary: 'obtener tipos de tecnologías' })
  @Roles(Role.Admin)
  @Get()
  async findAll(
    @Query() paginationParams: PaginationParams,
  ): Promise<PaginatedResponseDto<TechTypeResponseDto>> {
    const techTypesPaginated = await this.techTypesService.findAll(
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
  @Roles(Role.Admin)
  @Get(':id')
  async findOne(@Param('id', ParseObjectIdPipe) id: string): Promise<TechType> {
    return this.techTypesService.findById(id);
  }

  /**
   * Crea un tipo de tecnología.
   */
  @ApiOperation({ summary: 'crear tipo de tecnología' })
  @Roles(Role.Admin)
  @Post()
  async create(
    @Body() createTechTypeDto: CreateTechTypeDto,
  ): Promise<TechType> {
    return this.techTypesService.create(createTechTypeDto);
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
    await this.techTypesService.remove(id);
  }
}
