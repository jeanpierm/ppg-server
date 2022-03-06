import { Type } from 'class-transformer';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class GetProfessionalProfilesQuery {
  @IsOptional()
  @Type(() => Date)
  readonly initDate?: Date;

  @IsOptional()
  @Type(() => Date)
  readonly endDate?: Date;

  @IsOptional()
  @IsString()
  readonly jobTitle?: string;

  @IsOptional()
  @IsString()
  readonly location?: string;
}
