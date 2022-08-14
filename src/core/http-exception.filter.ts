import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LogsService } from '../logs/logs.service';
import { httpCodeResolver } from '../logs/utils/http-code-resolver';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logsService: LogsService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.message;

    // async save log
    const logId = this.logsService.save({
      ctx,
      message,
      err: exception,
    });
    this.logsService.print({ logId, ctx, err: exception });

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      error: httpCodeResolver(status),
    });
  }
}
