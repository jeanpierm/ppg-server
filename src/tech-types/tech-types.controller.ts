import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TechTypesService } from './tech-types.service';
import { CreateTechTypeDto } from './dto/create-tech-type.dto';
import { UpdateTechTypeDto } from './dto/update-tech-type.dto';

@Controller('tech-types')
export class TechTypesController {
  constructor(private readonly techTypesService: TechTypesService) {}

  @Post()
  create(@Body() createTechTypeDto: CreateTechTypeDto) {
    return this.techTypesService.create(createTechTypeDto);
  }

  @Get()
  findAll() {
    return this.techTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.techTypesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTechTypeDto: UpdateTechTypeDto) {
    return this.techTypesService.update(+id, updateTechTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.techTypesService.remove(+id);
  }
}
