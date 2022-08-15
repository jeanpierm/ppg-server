import { HttpException, Injectable, Logger, LogLevel } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import { Model } from 'mongoose';
import { PaginatedResponseDto } from '../shared/dto/paginated-response.dto';
import { PaginationQuery } from '../shared/dto/pagination-query.dto';
import { stringToDate } from '../shared/util';
import { User } from '../users/schemas/user.schema';
import { CreateLogDto } from './dto/create-log.dto';
import { FindLogsQuery } from './dto/logs-query.dto';
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

    // save in db asynchronously
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

  async findPaginated({
    size,
    search,
    page,
    startDate,
    endDate,
    level,
    httpMethod,
    statusCode,
  }: PaginationQuery & FindLogsQuery = {}): Promise<PaginatedResponseDto<Log>> {
    const filterQuery: Record<string, any> = {};
    if (search)
      filterQuery['$or'] = [
        { className: new RegExp(search, 'i') },
        { hostname: new RegExp(search, 'i') },
        { ip: new RegExp(search, 'i') },
        { logId: new RegExp(search, 'i') },
        { message: new RegExp(search, 'i') },
        { methodKey: new RegExp(search, 'i') },
        { path: new RegExp(search, 'i') },
        { userId: new RegExp(search, 'i') },
      ];
    if (startDate || endDate) filterQuery.timestamp = {};
    if (startDate) filterQuery.timestamp['$gte'] = stringToDate(startDate);
    if (endDate) filterQuery.timestamp['$lt'] = stringToDate(endDate);
    if (level) filterQuery.level = new RegExp(level, 'i');
    if (httpMethod) filterQuery.httpMethod = new RegExp(httpMethod, 'i');
    if (statusCode) filterQuery.statusCode = statusCode;

    const logs = await this.logModel
      .find(filterQuery)
      .sort({ timestamp: -1 })
      .skip((page - 1) * size)
      .limit(size)
      .lean();
    const totalItems = await this.logModel.count(filterQuery);
    const totalPages = Math.ceil(totalItems / size);

    return {
      totalItems,
      currentPage: page,
      pageSize: size,
      data: logs,
      totalPages,
    };
  }
}
