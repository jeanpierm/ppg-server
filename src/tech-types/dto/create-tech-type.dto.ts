import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTechTypeDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly label: string;
}
