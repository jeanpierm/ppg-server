import { HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { httpCodeResolver } from './http-code-resolver';

type BuildLog = {
  req: Request;
  res: Response;
  logId: string;
  err?: HttpException;
};

export function buildLogMessage({ req, res, logId, err }: BuildLog): string {
  const { method, path } = req;
  const statusCode = err ? err.getStatus() : res.statusCode;
  const statusMessage = httpCodeResolver(statusCode);
  const message = `${method} ${path} - ${statusCode} ${statusMessage} - ${
    logId || 'not saved'
  }`;
  return message;
}
