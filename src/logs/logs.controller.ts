import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { LogsService } from './logs.service';

@ApiTags('logs')
@Controller('logs')
@ApiBearerAuth()
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @ApiOperation({ summary: 'obtener logs' })
  @Get()
  @Roles(Role.Admin)
  async findAll() {
    const logs = await this.logsService.findAll();
    return logs;
  }
}
