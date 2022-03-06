import { Injectable, NotFoundException } from '@nestjs/common';
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

    if (!isRegistered) {
      throw new NotFoundException('User not found in database');
    }

    return true;
  }

  defaultMessage(): string {
    return 'User $value not found';
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
