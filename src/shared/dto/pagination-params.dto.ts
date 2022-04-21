import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PaginationParams {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  size = 15;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page = 1;

  @IsOptional()
  @IsString()
  search?: string;
}
