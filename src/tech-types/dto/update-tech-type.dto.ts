import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { EntityStatus } from '../../shared/enums/status.enum';
import { generateValidationMessageByValues } from '../../shared/util';
import { CreateTechTypeDto } from './create-tech-type.dto';

export class UpdateTechTypeDto extends PartialType(CreateTechTypeDto) {
  @IsEnum(EntityStatus, {
    message: function ({ property }) {
      return generateValidationMessageByValues(
        property,
        Object.values(EntityStatus),
      );
    },
  })
  @IsOptional()
  status?: EntityStatus;
}
