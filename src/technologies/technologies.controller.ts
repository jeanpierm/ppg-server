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
import { Public } from 'src/auth/decorators/public.decorator';
import { ApiResponse } from '../shared/dto/api-response.dto';
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
  @Public()
  async findAll(@Query() { type }: FindTechnologiesParams) {
    const technologies = await this.technologiesService.findAll(type);
    const payload = technologies.map((technology) =>
      TechnologiesMapper.toTechnologyResponse(technology),
    );
    return new ApiResponse('Technologies obtained successfully', payload);
  }

  @Get(':technologyId')
  @Public()
  async findOne(@Param() { technologyId }: FindTechnologyParams) {
    const technology = await this.technologiesService.findById(technologyId);
    const payload = TechnologiesMapper.toTechnologyResponse(technology);
    return new ApiResponse('Technology obtained successfully', payload);
  }

  @Post()
  @Public()
  async create(@Body() createTechnologyDto: CreateTechnologyDto) {
    const technology = await this.technologiesService.create(createTechnologyDto);
    const payload = TechnologiesMapper.toTechnologyResponse(technology);
    return new ApiResponse('Technology created successfully', payload);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':technologyId')
  @Public()
  async update(
    @Param() { technologyId }: FindTechnologyParams,
    @Body() updateTechnologyDto: UpdateTechnologyDto,
  ): Promise<void> {
    await this.technologiesService.update(technologyId, updateTechnologyDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':technologyId')
  @Public()
  async remove(@Param() { technologyId }: FindTechnologyParams): Promise<void> {
    await this.technologiesService.remove(technologyId);
  }
}
