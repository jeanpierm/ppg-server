import { Injectable, Logger, NestMiddleware, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';
import { ProfessionalProfile } from '../schemas/professional-profile.schema';

@Injectable()
export class ValidateProfileIsActiveMiddleware implements NestMiddleware {
  private readonly logger = new Logger(ValidateProfileIsActiveMiddleware.name);

  constructor(
    @InjectModel(ProfessionalProfile.name)
    private readonly profileModel: Model<ProfessionalProfile>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { ppId } = req.params;
    if (ppId) {
      this.logger.debug(`Validando que exista perfil con uuid ${ppId}...`);
      const profile = await this.profileModel.findOne({ ppId });
      if (profile.isInactive()) {
        this.logger.warn(`Perfil solicitado ${ppId} está con estado ${profile.status}`);
        throw new NotFoundException('Profile not found in database');
      }
      res.locals.profile = profile;
      this.logger.debug(`Profile ${ppId} saved in res.locals`);
    }
    next();
  }
}
