import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTechTypeDto {
  /**
   * El nombre que identifica al tipo de tecnología
   * @example language
   */
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  /**
   * Un label que puede ser usado como título
   * @example Lenguajes
   */
  @IsString()
  @IsNotEmpty()
  readonly label: string;
}
