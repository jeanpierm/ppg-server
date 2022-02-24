import { IsNotEmpty, IsString } from 'class-validator';

export class GeneratePpgDto {
  @IsString()
  @IsNotEmpty()
  readonly jobTitle: string;

  @IsString()
  @IsNotEmpty()
  readonly location: string;
}
