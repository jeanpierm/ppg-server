import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateTechnologyDto {
  @IsString()
  @IsNotEmpty()
  typeId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @ArrayMinSize(1)
  @IsArray()
  identifiers: string[];
}
