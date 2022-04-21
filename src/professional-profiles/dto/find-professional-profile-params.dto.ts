import { IsString, IsUUID } from 'class-validator';

export class FindProfessionalProfileParams {
  @IsUUID()
  @IsString()
  readonly ppId: string;
}
