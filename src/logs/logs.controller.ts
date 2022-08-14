import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { PaginationQuery } from '../shared/dto/pagination-query.dto';
import { FindLogsQuery } from './dto/logs-query.dto';
import { LogsService } from './logs.service';

@ApiTags('logs')
@Controller('logs')
@ApiBearerAuth()
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @ApiOperation({ summary: 'obtener logs' })
  @Get()
  @Roles(Role.Admin)
  async findAll(@Query() query: PaginationQuery & FindLogsQuery) {
    const logs = await this.logsService.findPaginated(query);
    return logs;
  }
}
