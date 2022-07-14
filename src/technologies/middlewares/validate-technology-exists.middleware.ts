import {
  Injectable,
  Logger,
  NestMiddleware,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';
import { Technology, TechnologyDocument } from '../schemas/technology.schema';

@Injectable()
export class ValidateTechnologyExistsMiddleware implements NestMiddleware {
  private readonly logger = new Logger(ValidateTechnologyExistsMiddleware.name);

  constructor(
    @InjectModel(Technology.name)
    private readonly technologyModel: Model<TechnologyDocument>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const excludedValues = ['search'];
    const { technologyId } = req.params;
    if (technologyId && !excludedValues.includes(technologyId)) {
      this.logger.debug(
        `Validando que exista tecnología con uuid ${technologyId}...`,
      );
      const technology = await this.technologyModel
        .findOne({ technologyId })
        .lean();
      if (!technology) {
        this.logger.warn(`Tecnología solicitada ${technologyId} no existe`);
        throw new NotFoundException('Technology not found in database');
      }
      res.locals.technology = technology;
      this.logger.debug(`Tecnología ${technologyId} guardada en res.locals`);
    }
    next();
  }
}
