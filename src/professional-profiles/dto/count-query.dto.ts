import { IsEnum, IsNotEmpty } from 'class-validator';
import { TechType } from '../enums/tech-type.enum';

export const COUNT_ENGLISH_QUERY = 'english';
const formatter = new (Intl as any).ListFormat('en', { style: 'short', type: 'disjunction' });
const countQueryValues = [...Object.values(TechType), COUNT_ENGLISH_QUERY];

export class CountQuery {
  @IsEnum(countQueryValues, {
    message: `type should be ${formatter.format(countQueryValues)}`,
  })
  @IsNotEmpty()
  readonly q: string;
}
