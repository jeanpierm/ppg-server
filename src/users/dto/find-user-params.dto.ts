import { IsMongoId } from 'class-validator';
import { IsRegistered } from '../validators/is-registered.validator';

export class FindUserParams {
  @IsRegistered()
  @IsMongoId()
  readonly id: string;
}
