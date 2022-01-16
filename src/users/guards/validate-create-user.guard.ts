import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
import { Observable } from 'rxjs';
import { User, UserDocument } from '../schemas/users.schema';

@Injectable()
export class ValidateCreateUser implements CanActivate {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const { email } = request.body;

    if (!email) return true;
    const emailAlreadyExist = await this.userModel.exists({ email });

    if (emailAlreadyExist) {
      throw new BadRequestException('Email already registered');
    }

    return true;
  }
}
