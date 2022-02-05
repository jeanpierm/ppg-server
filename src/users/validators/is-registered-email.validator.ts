import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/users.schema';

@ValidatorConstraint({ name: 'IsRegisteredEmail', async: true })
@Injectable()
export class IsRegisteredEmailValidator
  implements ValidatorConstraintInterface
{
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async validate(email: string): Promise<boolean> {
    const isRegistered = await this.userModel.exists({ email });

    return isRegistered;
  }

  defaultMessage(): string {
    return 'User not found';
  }
}

export function IsRegisteredEmail(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsRegisteredEmail',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsRegisteredEmailValidator,
    });
  };
}
