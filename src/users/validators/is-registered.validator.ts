import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  isMongoId,
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

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async validate(id: string): Promise<boolean> {
    if (!isMongoId(id)) {
      throw new BadRequestException('Identificador no válido');
    }
    const isRegistered = await this.userModel.exists({ _id: id });

    return isRegistered;
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
