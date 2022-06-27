import { IsUUID } from 'class-validator';

export class FindDpParams {
  @IsUUID()
  readonly dpId: string;
}
