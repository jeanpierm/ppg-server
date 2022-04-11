import { ArrayMinSize, IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TechType } from 'src/professional-profiles/enums/tech-type.enum';
import { TechnologyIntf } from '../interfaces/technology.interface';

export class CreateTechnologyDto implements TechnologyIntf {
  @IsEnum(TechType, {
    message: `technology type must be ${Object.values(TechType).join(' or ')}`,
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
