import { IsString, IsUUID } from 'class-validator';

export class FindTechnologyParams {
  @IsUUID()
  @IsString()
  readonly technologyId: string;
}
