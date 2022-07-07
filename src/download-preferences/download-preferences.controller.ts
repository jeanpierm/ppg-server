import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { ApiOkCustomResponse } from 'src/shared/decorators/api-response.decorator';
import { ApiResponse } from 'src/shared/dto/api-response.dto';
import { UserDocument } from 'src/users/schemas/user.schema';
import { DownloadPreferencesService } from './download-preferences.service';
import { DownloadPreferencesResponse } from './dto/dp-response.dto';
import { FindDpParams } from './dto/find-dp-params.dto';
import { UpdateDpDto } from './dto/update-dp.dto';
import { DownloadPreferencesMapper } from './mapper/dp-mapper';

@ApiTags('download-preferences')
@Controller('download-preferences')
@ApiBearerAuth()
export class DownloadPreferencesController {
  constructor(
    private readonly downloadPreferencesService: DownloadPreferencesService,
  ) {}

  @ApiOperation({ summary: 'obtener preferencias' })
  @ApiOkCustomResponse(DownloadPreferencesResponse)
  @Get()
  @Roles(Role.User, Role.Admin)
  async findAll(
    @CurrentUser() user: UserDocument,
  ): Promise<ApiResponse<DownloadPreferencesResponse>> {
    const downloadPreferences =
      await this.downloadPreferencesService.getDownloadPreferences(user);
    const payload = DownloadPreferencesMapper.toResponse(downloadPreferences);
    return new ApiResponse('Preferencias de descarga obtenidas', payload);
  }

  /**
   * Actualiza las preferencias de descarga según el dpId.
   */
  @ApiOperation({ summary: 'actualizar preferencias de descarga' })
  @Patch(':dpId')
  @Roles(Role.User, Role.Admin)
  async update(
    @CurrentUser() user: UserDocument,
    @Param() { dpId }: FindDpParams,
    @Body() updateDpDto: UpdateDpDto,
  ) {
    const downloadPreferences =
      await this.downloadPreferencesService.updateDownloadPreferences(
        user,
        dpId,
        updateDpDto,
      );
    const payload = DownloadPreferencesMapper.toResponse(downloadPreferences);
    return new ApiResponse('Preferencias de descarga modificadas', payload);
  }

  @ApiOperation({ summary: 'descargar resume segun el ppId' })
  @Get('pdf/:ppId')
  @Roles(Role.User, Role.Admin)
  async getResume(
    @CurrentUser() user: UserDocument,
    @Param() param: any,
  ): Promise<any> {
    return await this.downloadPreferencesService.downloadResume(user, param);
  }
}
