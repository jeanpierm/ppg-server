import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/users.schema';

@ValidatorConstraint({ name: 'IsRegistered', async: true })
@Injectable()
export class IsRegisteredValidator implements ValidatorConstraintInterface {
  private readonly logger = new Logger(IsRegisteredValidator.name);

  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async validate(id: string): Promise<boolean> {
    const isRegistered = await this.userModel.exists({ _id: id });

    if (!isRegistered) {
      throw new NotFoundException('User not found in database');
    }

    return true;
  }

  defaultMessage(): string {
    return 'User $value not found';
  }
}

export function IsRegistered(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsRegistered',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsRegisteredValidator,
    });
  };
}
