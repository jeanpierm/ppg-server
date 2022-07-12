import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { ApiOkCustomResponse } from 'src/shared/decorators/api-response.decorator';
import { ApiResponse } from 'src/shared/dto/api-response.dto';
import { UserDocument } from 'src/users/schemas/user.schema';
import { DownloadPreferencesService } from './download-preferences.service';
import { DownloadPreferencesResponse } from './dto/dp-response.dto';
import { UpdateDpDto } from './dto/update-dp.dto';
import { DownloadPreferencesMapper } from './mapper/dp-mapper';

@ApiTags('download-preferences')
@Controller()
@ApiBearerAuth()
export class DownloadPreferencesController {
  constructor(
    private readonly downloadPreferencesService: DownloadPreferencesService,
  ) {}

  /**
   * Obtiene las preferencias de descarga de la cuenta autenticada.
   */
  @ApiOperation({ summary: 'obtener preferencias' })
  @ApiOkCustomResponse(DownloadPreferencesResponse)
  @Get('me/download-preferences')
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
   * Actualiza las preferencias de descarga de la cuenta autenticada.
   */
  @ApiOperation({ summary: 'actualizar preferencias de descarga' })
  @Patch('me/download-preferences')
  @Roles(Role.User, Role.Admin)
  async update(
    @CurrentUser() user: UserDocument,
    @Body() updateDpDto: UpdateDpDto,
  ) {
    const downloadPreferences =
      await this.downloadPreferencesService.updateDownloadPreferences(
        user,
        updateDpDto,
      );
    const payload = DownloadPreferencesMapper.toResponse(downloadPreferences);
    return new ApiResponse('Preferencias de descarga modificadas', payload);
  }
}
