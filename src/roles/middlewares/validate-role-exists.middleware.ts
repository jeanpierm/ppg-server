import {
  Injectable,
  Logger,
  NestMiddleware,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';
import { RoleDocument, RoleEntity } from '../schemas/role.schema';

@Injectable()
export class ValidateRoleExistsMiddleware implements NestMiddleware {
  private readonly logger = new Logger(ValidateRoleExistsMiddleware.name);

  constructor(
    @InjectModel(RoleEntity.name)
    private readonly roleModel: Model<RoleDocument>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { roleId } = req.params;
    if (roleId) {
      const role = await this.roleModel.findOne({ roleId }).lean();
      if (!role) {
        throw new NotFoundException('Role not found in database');
      }
      res.locals.role = role;
    }
    next();
  }
}
