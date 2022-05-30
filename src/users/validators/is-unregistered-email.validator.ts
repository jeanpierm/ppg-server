import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@ValidatorConstraint({ name: 'IsUnregisteredEmail', async: true })
@Injectable()
export class IsUnregisteredEmailValidator
  implements ValidatorConstraintInterface
{
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async validate(email: string): Promise<boolean> {
    const isRegistered = await this.userModel.exists({ email });

    if (isRegistered) {
      throw new ConflictException('User with email already exist in database');
    }

    return !isRegistered;
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
