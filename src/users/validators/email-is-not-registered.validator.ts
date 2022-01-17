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

@ValidatorConstraint({ name: 'UserEmailExists', async: true })
@Injectable()
export class EmailIsNotRegisteredValidator
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

export function EmailIsNotRegistered(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'EmailIsNotRegistered',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: EmailIsNotRegisteredValidator,
    });
  };
}
