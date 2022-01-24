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

@ValidatorConstraint({ name: 'IsUnregisteredEmail', async: true })
@Injectable()
export class IsUnregisteredEmailValidator
  implements ValidatorConstraintInterface
{
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async validate(email: string): Promise<boolean> {
    const emailAlreadyExists = await this.userModel.exists({ email });

    return !emailAlreadyExists;
  }

  defaultMessage(): string {
    return 'Email already registered';
  }
}

export function IsUnregisteredEmail(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsUnregisteredEmail',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsUnregisteredEmailValidator,
    });
  };
}
