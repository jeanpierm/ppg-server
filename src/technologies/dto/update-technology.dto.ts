import { PartialType } from '@nestjs/swagger';
import { CreateTechnologyDto } from './create-technology.dto';

export class UpdateTechnologyDto extends PartialType(CreateTechnologyDto) {}
