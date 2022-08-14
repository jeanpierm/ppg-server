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
import {
  ApiCreatedCustomResponse,
  ApiOkCustomResponse,
  ApiPaginatedResponse,
} from '../shared/decorators/api-response.decorator';
import { ApiResponse } from '../shared/dto/api-response.dto';
import { PaginatedResponseDto } from '../shared/dto/paginated-response.dto';
import { PaginationQuery } from '../shared/dto/pagination-query.dto';
import { CreateTechnologyDto } from './dto/create-technology.dto';
import { TechnologyResponse } from './dto/technology-response.dto';
import { UpdateTechnologyDto } from './dto/update-technology.dto';
import { TechnologiesMapper } from './mappers/technologies.mapper';
import { TechnologiesService } from './technologies.service';

@ApiTags('technologies')
@Controller('technologies')
@ApiBearerAuth()
export class TechnologiesController {
  constructor(private readonly technologiesService: TechnologiesService) {}

  /**
   * Busca las tecnologías configuradas para el algoritmo que genera los perfiles profesionales.
   *
   */
  @ApiOperation({ summary: 'buscar tecnologías' })
  @ApiPaginatedResponse(TechnologyResponse)
  @Get()
  @Roles(Role.Admin, Role.User)
  async findAll(
    @Query() paginationParams: PaginationQuery,
    @Query('type') type: string,
  ): Promise<PaginatedResponseDto<TechnologyResponse>> {
    const technologiesPagination = await this.technologiesService.findAll(
      paginationParams,
      type,
    );
    const payload: PaginatedResponseDto<TechnologyResponse> = {
      ...technologiesPagination,
      data: technologiesPagination.data.map((technology) =>
        TechnologiesMapper.toTechnologyResponse(technology),
      ),
    };
    return payload;
  }

  /**
   * A través de web scraping se obtienen cursos de acuerdo a un criterio de búsqueda. Ejemplo: "Java"
   *
   */
  @ApiOperation({ summary: 'buscar cursos' })
  @Get('search')
  @Roles(Role.Admin, Role.User)
  async courseScraping(@Query('course') course: string) {
    const courses = await this.technologiesService.findCourses(course);
    return new ApiResponse('Courses obtained successfully', courses);
  }

  /**
   * Encuentra una tecnología por su nombre (case sensitive).
   */
  @ApiOperation({ summary: 'buscar tecnología' })
  @ApiOkCustomResponse(TechnologyResponse)
  @Get(':name')
  @Roles(Role.Admin, Role.User)
  async findOne(@Param('name') name: string) {
    const technology = await this.technologiesService.findByName(name);
    const payload = TechnologiesMapper.toTechnologyResponse(technology);
    return new ApiResponse('Technology obtained successfully', payload);
  }

  /**
   * Crea una tecnología.
   */
  @ApiOperation({ summary: 'crear tecnología' })
  @ApiCreatedCustomResponse(TechnologyResponse)
  @Post()
  @Roles(Role.Admin)
  async create(@Body() createTechnologyDto: CreateTechnologyDto) {
    const technology = await this.technologiesService.create(
      createTechnologyDto,
    );
    const payload = TechnologiesMapper.toTechnologyResponse(technology);
    return new ApiResponse('Technology created successfully', payload);
  }

  /**
   * Actualiza una tecnología.
   */
  @ApiOperation({ summary: 'actualizar tecnología' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':technologyId')
  @Roles(Role.Admin)
  async update(
    @Param('technologyId') technologyId: string,
    @Body() updateTechnologyDto: UpdateTechnologyDto,
  ): Promise<void> {
    await this.technologiesService.update(technologyId, updateTechnologyDto);
  }

  /**
   * Elimina nueva tecnología.
   */
  @ApiOperation({ summary: 'eliminar tecnología' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':technologyId')
  @Roles(Role.Admin)
  async remove(@Param('technologyId') technologyId: string): Promise<void> {
    await this.technologiesService.remove(technologyId);
  }
}
