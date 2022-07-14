import { PartialType } from '@nestjs/swagger';
import { CreateTechTypeDto } from './create-tech-type.dto';

export class UpdateTechTypeDto extends PartialType(CreateTechTypeDto) {}
