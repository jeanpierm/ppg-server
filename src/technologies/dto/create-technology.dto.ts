import { ArrayMinSize, IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TechType } from 'src/professional-profiles/enums/tech-type.enum';
import { generateValidationMessageByValues } from '../../shared/util';
import { TechnologyIntf } from '../interfaces/technology.interface';

export class CreateTechnologyDto implements TechnologyIntf {
  @IsEnum(TechType, {
    message: generateValidationMessageByValues('type', Object.values(TechType)),
  })
  @IsNotEmpty()
  type: TechType;

  @IsString()
  @IsNotEmpty()
  name: string;

  @ArrayMinSize(1)
  @IsArray()
  identifiers: string[];
}
