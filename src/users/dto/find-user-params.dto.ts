import { IsUUID } from 'class-validator';

export class FindUserParams {
  @IsUUID()
  readonly userId: string;
}
