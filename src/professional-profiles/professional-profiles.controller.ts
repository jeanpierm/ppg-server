import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { CurrentUser } from 'src/core/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { GetProfessionalProfilesQuery } from 'src/professional-profiles/dto/get-professional-profiles-query.dto';
import { ApiResponse } from 'src/shared/dto/api-response.dto';
import { UserDocument } from 'src/users/schemas/user.schema';
import {
  ApiCreatedCustomResponse,
  ApiOkCustomResponse,
  ApiOkCustomResponseArray,
} from '../shared/decorators/api-response.decorator';
import { PaginatedResponseDto } from '../shared/dto/paginated-response.dto';
import { PaginationParams } from '../shared/dto/pagination-params.dto';
import { CountQuery } from './dto/count-query.dto';
import { GeneratePpgDto } from './dto/generate-ppg.dto';
import { ProfessionalProfileResponse } from './dto/professional-profile-response.dto';
import { ProfessionalProfilesMapper } from './mapper/professional-profiles.mapper';
import { ProfessionalProfilesService } from './services/professional-profiles.service';

@ApiTags('professional-profiles')
@Controller('professional-profiles')
@ApiBearerAuth()
export class ProfessionalProfilesController {
  constructor(
    private readonly proProfilesService: ProfessionalProfilesService,
  ) {}

  /**
   * Obtiene los perfiles profesionales activos generados por la cuenta autenticada.
   */
  @ApiOperation({ summary: 'obtener perfiles' })
  @ApiOkCustomResponseArray(ProfessionalProfileResponse)
  @Get()
  @Roles(Role.User, Role.Admin)
  async get(
    @Query()
    getQuery: GetProfessionalProfilesQuery & PaginationParams,
    @CurrentUser() user: UserDocument,
  ): Promise<PaginatedResponseDto<ProfessionalProfileResponse>> {
    const profiles = await this.proProfilesService.findActiveProfilesOfUser(
      user,
      getQuery,
    );
    const payload: PaginatedResponseDto<ProfessionalProfileResponse> = {
      ...profiles,
      data: profiles.data.map((profile) =>
        ProfessionalProfilesMapper.toResponse(profile),
      ),
    };

    return payload;
  }

  /**
   * Obtiene un perfil profesional aleatorio de la base de datos.
   */
  @ApiOperation({ summary: 'obtener perfil aleatorio' })
  @ApiOkCustomResponse(ProfessionalProfileResponse)
  @Get('random')
  @Roles(Role.User, Role.Admin)
  async getRandom(): Promise<ApiResponse<ProfessionalProfileResponse>> {
    const profile = await this.proProfilesService.getRandomProfile();
    const payload = ProfessionalProfilesMapper.toResponse(profile);
    return new ApiResponse(
      'Random professional profile obtained successfully',
      payload,
    );
  }

  /**
   * Obtiene un diccionario con el conteo de tecnolog??as encontradas en los perfiles de la cuenta autenticada.
   */
  @ApiOperation({ summary: 'contar tecnolog??as de los perfiles generados' })
  @Roles(Role.User, Role.Admin)
  @Get('count')
  async count(@CurrentUser() user: UserDocument, @Query() { q }: CountQuery) {
    const profiles = await this.proProfilesService.findActiveProfilesOfUser(
      user,
    );
    const payload =
      q === 'english'
        ? await this.proProfilesService.getEnglishCount(profiles.data)
        : await this.proProfilesService.getTechnologyCount(profiles.data, q);
    return new ApiResponse(`${q} count obtained successfully`, payload);
  }

  @Roles(Role.User, Role.Admin)
  @Get('download/:ppId')
  async resume(
    @Res() res: Response,
    @CurrentUser() user: UserDocument,
    @Param('ppId') ppId: string,
  ) {
    const pdfBuffer = await this.proProfilesService.resume(user, ppId);
    res.contentType('application/pdf');
    res.set({ 'Content-Length': pdfBuffer.length });
    res.send(pdfBuffer);
  }

  /**
   * Obtiene un perfil profesional seg??n su ppId
   */
  @ApiOperation({ summary: 'obtener perfil' })
  @ApiOkCustomResponse(ProfessionalProfileResponse)
  @Get(':ppId')
  @Roles(Role.User, Role.Admin)
  async findOne(
    @CurrentUser() user: UserDocument,
    @Param('ppId') ppId: string,
  ): Promise<ApiResponse<ProfessionalProfileResponse>> {
    const profile = await this.proProfilesService.findActiveProfileOfUserById(
      ppId,
      user,
    );
    const payload = ProfessionalProfilesMapper.toResponse(profile);
    return new ApiResponse(
      'Professional profile obtained successfully',
      payload,
    );
  }

  /**
   * Generar un perfil profesional. El perfil es generado a trav??s de web scraping y procesamiento de los datos, para as?? conformar un perfil profesional con tecnolog??as altamente demandadas seg??n el t??tulo de trabajo y localidad enviados.
   */
  @ApiOperation({ summary: 'generar perfil' })
  @ApiCreatedCustomResponse(ProfessionalProfileResponse)
  @Post()
  @Roles(Role.User, Role.Admin)
  async generate(
    @CurrentUser() user: UserDocument,
    @Body() generatePpgDto: GeneratePpgDto,
  ): Promise<ApiResponse<ProfessionalProfileResponse>> {
    const { jobTitle, location } = generatePpgDto;
    const generatedProProfile = await this.proProfilesService.generateProfile(
      user,
      jobTitle,
      location,
    );
    const payload = ProfessionalProfilesMapper.toResponse(generatedProProfile);
    return new ApiResponse(
      'Professional profile generated successfully',
      payload,
    );
  }

  /**
   * ELimina de manera l??gica (inactiva) un perfil profesional seg??n su ppId
   */
  @ApiOperation({ summary: 'eliminar perfil' })
  @ApiOkResponse({ type: ApiResponse })
  @Delete(':ppId')
  @Roles(Role.User, Role.Admin)
  async removeOne(
    @CurrentUser() user: UserDocument,
    @Param('ppId') ppId: string,
  ) {
    await this.proProfilesService.removeProfileOfUser(user, ppId);
    return new ApiResponse('Professional profile deleted successfully');
  }
}
