import { IsNotEmpty, IsString } from 'class-validator';

export class CountQuery {
  @IsString()
  @IsNotEmpty()
  readonly q: string;
}
