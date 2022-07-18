import { IsOptional } from 'class-validator';
export class GetTechTypeQuery {
  @IsOptional()
  readonly status?: string;
}
