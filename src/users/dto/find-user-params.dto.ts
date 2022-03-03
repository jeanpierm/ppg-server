import { IsUUID } from 'class-validator';
import { IsRegistered } from '../validators/is-registered.validator';

export class FindUserParams {
  @IsRegistered()
  @IsUUID()
  readonly userId: string;
}
