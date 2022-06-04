import { IsOptional } from 'class-validator';

export class GetProfessionalProfilesQuery {
  @IsOptional()
  readonly initDate?: string;

  @IsOptional()
  readonly endDate?: string;

  @IsOptional()
  readonly jobTitle?: string;

  @IsOptional()
  readonly location?: string;
}
