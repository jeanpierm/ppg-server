import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable, tap } from 'rxjs';
import { LogsService } from './logs.service';

/**
 * Logging success requests.
 * To error requests, see HttpExceptionFilter.
 */
@Injectable()
export class LogsInterceptor implements NestInterceptor {
  constructor(private readonly logsService: LogsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const res = ctx.getResponse<Response>();

    // save util data in res.locals to use later in LogsService...
    res.locals.className = context.getClass().name;
    res.locals.methodKey = context.getHandler().name;

    return next.handle().pipe(
      tap(async (incomingResponse: Promise<unknown>) => {
        const result = (await incomingResponse) || {};
        // async save log
        const logId = this.logsService.save({
          ctx,
          message: result['message'],
        });
        this.logsService.print({ logId, ctx });
      }),
    );
  }
}
