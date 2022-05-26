import { IsEnum, IsOptional } from 'class-validator';
import { TechType } from 'src/professional-profiles/enums/tech-type.enum';
import { generateValidationMessageByValues } from '../../shared/util';

export class FindTechnologiesParams {
  @IsEnum(TechType, {
    message: generateValidationMessageByValues('type', Object.values(TechType)),
  })
  @IsOptional()
  readonly type?: TechType;
}
