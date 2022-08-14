import { LogLevel } from '@nestjs/common';

export class CreateLogDto {
  logId?: string;
  level: LogLevel;
  timestamp: Date;
  statusCode: number;
  message?: string;
  httpMethod: string;
  path: string;
  methodKey: string;
  className: string;
  ip: string;
  hostname: string;
  userId: string;
  exception?: string;
}
