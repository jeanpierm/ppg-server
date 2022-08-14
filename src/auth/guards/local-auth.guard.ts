import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LogsService } from '../../logs/logs.service';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor(private readonly logsService: LogsService) {
    super();
  }
}
