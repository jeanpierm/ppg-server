import { HttpException, Injectable, Logger, LogLevel } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { CreateLogDto } from './dto/create-log.dto';
import { Log, LogDocument } from './schemas/log.schema';
import { buildLogMessage } from './utils/build-log-message';
import { httpCodeResolver } from './utils/http-code-resolver';

type SaveLogArgs = {
  ctx: HttpArgumentsHost;
  message?: string;
  err?: HttpException;
};

type PrintLogArgs = {
  logId: string;
  ctx: HttpArgumentsHost;
  err?: HttpException;
};

@Injectable()
export class LogsService {
  private readonly logger = new Logger();

  constructor(
    @InjectModel(Log.name)
    private readonly logModel: Model<LogDocument>,
  ) {}

  /**
   * Save a log of the request in database.
   * @returns the logIg
   */
  save({ ctx, message, err }: SaveLogArgs) {
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();
    const logId = randomUUID();
    const now = new Date();
    const level: LogLevel = err ? 'error' : 'log';
    const log: CreateLogDto = {
      logId,
      level,
      timestamp: now,
      statusCode: err ? err.getStatus() : res.statusCode,
      message: message || res.statusMessage || httpCodeResolver(res.statusCode),
      httpMethod: req.method,
      path: req.path,
      methodKey: res.locals.methodKey,
      className: res.locals.className,
      ip: req.ip,
      hostname: req.hostname,
      userId: (req.user as User)?.userId || 'unauthenticated',
      exception: err?.name,
    };

    // save in db asynchrouysly
    this.logModel.create(log);

    return logId;
  }

  /**
   * Print a log in console.
   *
   * @example
   * GET /ppg-api/v1/account - 200 OK - a4739032-a4e5-4297-b8b0-891854a249ed
   */
  print({ logId, ctx, err }: PrintLogArgs) {
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();
    const className = res.locals.className;

    const logMessage: string = buildLogMessage({ req, res, logId, err });

    if (err) {
      this.logger.error(logMessage, className);
    } else {
      this.logger.log(logMessage, className);
    }
  }

  async findAll() {
    const logs = await this.logModel.find({});
    return logs;
  }
}
