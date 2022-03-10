import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  ValidateNested,
} from 'class-validator';
import { TechType } from 'src/professional-profiles/enums/tech-type.enum';
import { TechDictionary } from './tech-dictionary.dto';

export class CreateTechnologyDto {
  @IsEnum(TechType, {
    message: `technology type must be ${Object.values(TechType).join(' or ')}`,
  })
  @IsNotEmpty()
  readonly type: TechType;

  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => TechDictionary)
  readonly dictionary: TechDictionary;
}
