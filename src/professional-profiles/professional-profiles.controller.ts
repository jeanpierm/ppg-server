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
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { CurrentUser } from 'src/auth/current-user.decorator';
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
import {
  CountQuery,
  countQueryValues,
  COUNT_ENGLISH_QUERY,
} from './dto/count-query.dto';
import { GeneratePpgDto } from './dto/generate-ppg.dto';
import { ProfessionalProfileResponse } from './dto/professional-profile-response.dto';
import { TechType } from './enums/tech-type.enum';
import { ProfessionalProfilesMapper } from './mapper/professional-profiles.mapper';
import { ProfessionalProfilesService } from './professional-profiles.service';

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
    console.log(getQuery);
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
   * Obtiene un diccionario con el conteo de tecnologías encontradas en los perfiles de la cuenta autenticada.
   */
  @ApiOperation({ summary: 'contar tecnologías de los perfiles generados' })
  @ApiQuery({ name: 'q', enum: countQueryValues })
  @Roles(Role.User, Role.Admin)
  @Get('count')
  async count(@CurrentUser() user: UserDocument, @Query() { q }: CountQuery) {
    const profiles = await this.proProfilesService.findActiveProfilesOfUser(
      user,
    );
    const payload =
      q === COUNT_ENGLISH_QUERY
        ? await this.proProfilesService.getEnglishCount(profiles.data)
        : await this.proProfilesService.getTechnologyCount(
            profiles.data,
            q as TechType,
          );
    return new ApiResponse(`${q} count obtained successfully`, payload);
  }

  @Get('download/:ppId')
  @Roles(Role.User, Role.Admin)
  async resume(
    @Res() res: Response,
    @CurrentUser() user: UserDocument,
    @Param('ppId') ppId: string,
  ) {
    return this.proProfilesService.resume(res, user, ppId);
  }

  /**
   * Obtiene un perfil profesional según su ppId
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
   * Generar un perfil profesional. El perfil es generado a través de web scraping y procesamiento de los datos, para así conformar un perfil profesional con tecnologías altamente demandadas según el título de trabajo y localidad enviados.
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
   * ELimina de manera lógica (inactiva) un perfil profesional según su ppId
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
