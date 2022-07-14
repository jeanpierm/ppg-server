import { Injectable } from '@nestjs/common';
import { CreateTechTypeDto } from './dto/create-tech-type.dto';
import { UpdateTechTypeDto } from './dto/update-tech-type.dto';

@Injectable()
export class TechTypesService {
  create(createTechTypeDto: CreateTechTypeDto) {
    return 'This action adds a new techType';
  }

  findAll() {
    return `This action returns all techTypes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} techType`;
  }

  update(id: number, updateTechTypeDto: UpdateTechTypeDto) {
    return `This action updates a #${id} techType`;
  }

  remove(id: number) {
    return `This action removes a #${id} techType`;
  }
}
