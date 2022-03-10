import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class TechDictionary {
  @IsString()
  @IsNotEmpty()
  name: string;

  @ArrayMinSize(1)
  @IsArray()
  identifiers: string[];
}
