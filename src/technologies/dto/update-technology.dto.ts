import { PartialType } from '@nestjs/mapped-types';
import { CreateTechnologyDto } from './create-technology.dto';

export class UpdateTechnologyDto extends PartialType(CreateTechnologyDto) {}
