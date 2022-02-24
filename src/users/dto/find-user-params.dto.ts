import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { IsRegistered } from '../validators/is-registered.validator';

export class FindUserParams {
  @IsRegistered()
  @IsMongoId()
  readonly id: Types.ObjectId;
}
