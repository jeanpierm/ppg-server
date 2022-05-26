import { IsEnum, IsNotEmpty } from 'class-validator';
import { generateValidationMessageByValues } from '../../shared/util';
import { TechType } from '../enums/tech-type.enum';

export const COUNT_ENGLISH_QUERY = 'english';
export const countQueryValues = [...Object.values(TechType), COUNT_ENGLISH_QUERY];

export class CountQuery {
  @IsEnum(countQueryValues, {
    message: generateValidationMessageByValues('q', countQueryValues),
  })
  @IsNotEmpty()
  readonly q: string;
}
