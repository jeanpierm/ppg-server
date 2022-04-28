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
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../auth/enums/role.enum';
import { ApiResponse } from '../shared/dto/api-response.dto';
import { PaginationParams } from '../shared/dto/pagination-params.dto';
import { CreateTechnologyDto } from './dto/create-technology.dto';
import { FindTechnologiesParams } from './dto/find-technologies-params.dto';
import { FindTechnologyParams } from './dto/find-technology-params.dto';
import { UpdateTechnologyDto } from './dto/update-technology.dto';
import { TechnologiesMapper } from './mappers/technologies.mapper';
import { TechnologiesService } from './technologies.service';

@Controller('technologies')
export class TechnologiesController {
  constructor(private readonly technologiesService: TechnologiesService) {}

  @Get()
  @Roles(Role.Admin)
  async findAll(
    @Query() paginationParams: PaginationParams,
    @Query() { type }: FindTechnologiesParams,
  ) {
    const payload = await this.technologiesService.findAll(paginationParams, type);
    payload.data = payload.data.map((technology) =>
      TechnologiesMapper.toTechnologyResponse(technology),
    );
    return payload;
  }

  @Get(':technologyId')
  @Roles(Role.Admin)
  async findOne(@Param() { technologyId }: FindTechnologyParams) {
    const technology = await this.technologiesService.findById(technologyId);
    const payload = TechnologiesMapper.toTechnologyResponse(technology);
    return new ApiResponse('Technology obtained successfully', payload);
  }

  @Post()
  @Roles(Role.Admin)
  async create(@Body() createTechnologyDto: CreateTechnologyDto) {
    const technology = await this.technologiesService.create(createTechnologyDto);
    const payload = TechnologiesMapper.toTechnologyResponse(technology);
    return new ApiResponse('Technology created successfully', payload);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':technologyId')
  @Roles(Role.Admin)
  async update(
    @Param() { technologyId }: FindTechnologyParams,
    @Body() updateTechnologyDto: UpdateTechnologyDto,
  ): Promise<void> {
    await this.technologiesService.update(technologyId, updateTechnologyDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':technologyId')
  @Roles(Role.Admin)
  async remove(@Param() { technologyId }: FindTechnologyParams): Promise<void> {
    await this.technologiesService.remove(technologyId);
  }
}
