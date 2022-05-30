import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class Option {
  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  path: string;
}
