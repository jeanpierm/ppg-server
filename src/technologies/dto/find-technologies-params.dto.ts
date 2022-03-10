import { IsEnum, IsOptional } from 'class-validator';
import { TechType } from 'src/professional-profiles/enums/tech-type.enum';

export class FindTechnologiesParams {
  @IsEnum(TechType, {
    message: `type must be ${Object.values(TechType).join(' or ')}`,
  })
  @IsOptional()
  readonly type?: TechType;
}
