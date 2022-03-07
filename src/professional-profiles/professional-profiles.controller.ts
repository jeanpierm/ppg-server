import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiResponse } from 'src/shared/dto/api-response.dto';
import { GetProfessionalProfilesQuery } from 'src/professional-profiles/dto/get-professional-profiles-query.dto';
import { User } from 'src/users/schemas/users.schema';
import { GeneratePpgDto } from './dto/generate-ppg.dto';
import { ProfessionalProfileResponse } from './dto/professional-profile-response.dto';
import { ProfessionalProfilesMapper } from './mapper/professional-profiles.mapper';
import { ProfessionalProfilesService } from './professional-profiles.service';
import { tools } from './identifiers/tools';
import { databases } from './identifiers/databases';
import { frameworks } from './identifiers/frameworks';
import { languages } from './identifiers/languages';
import { paradigms } from './identifiers/paradigms';
import { patterns } from './identifiers/patterns';

@Controller('professional-profiles')
export class ProfessionalProfilesController {
  constructor(
    private readonly proProfilesService: ProfessionalProfilesService,
    private readonly proProfilesMapper: ProfessionalProfilesMapper,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async generate(
    @CurrentUser() user: User,
    @Body() generatePpgDto: GeneratePpgDto,
  ) {
    const { jobTitle, location } = generatePpgDto;
    const generatedProProfile = await this.proProfilesService.generate(
      user,
      jobTitle,
      location,
    );
    const payload =
      this.proProfilesMapper.mapToProfessionalProfileResponse(
        generatedProProfile,
      );

    return new ApiResponse(
      'Professional profile generated successfully',
      payload,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async get(
    @Query()
    { initDate, endDate, jobTitle, location }: GetProfessionalProfilesQuery,
    @CurrentUser() user: User,
  ): Promise<ApiResponse<ProfessionalProfileResponse[]>> {
    const profiles = await this.proProfilesService.getSortedByCreatedDateAsc(
      user,
      initDate,
      endDate,
      jobTitle,
      location,
    );
    const payload = profiles.map((profile) =>
      this.proProfilesMapper.mapToProfessionalProfileResponse(profile),
    );

    return new ApiResponse(
      'Professional profiles obtained successfully',
      payload,
    );
  }

  @Get('random')
  async getRandom(): Promise<ApiResponse<ProfessionalProfileResponse>> {
    const profile = await this.proProfilesService.getRandom();
    const payload =
      this.proProfilesMapper.mapToProfessionalProfileResponse(profile);

    return new ApiResponse(
      'Random professional profile obtained successfully',
      payload,
    );
  }

  @Get('languages/count')
  async getLanguagesCount() {
    const payload = await this.proProfilesService.getTechnologyCount(
      languages,
      'languages',
    );
    return new ApiResponse('Languages count obtained successfully', payload);
  }

  @Get('frameworks/count')
  async getFrameworksCount() {
    const payload = await this.proProfilesService.getTechnologyCount(
      frameworks,
      'frameworks',
    );
    return new ApiResponse('Frameworks count obtained successfully', payload);
  }

  @Get('databases/count')
  async getDatabasesCount() {
    const payload = await this.proProfilesService.getTechnologyCount(
      databases,
      'databases',
    );
    return new ApiResponse('Databases count obtained successfully', payload);
  }

  @Get('tools/count')
  async getToolsCount() {
    const payload = await this.proProfilesService.getTechnologyCount(
      tools,
      'tools',
    );
    return new ApiResponse('Tools count obtained successfully', payload);
  }

  @Get('paradigms/count')
  async getParadigmsCount() {
    const payload = await this.proProfilesService.getTechnologyCount(
      paradigms,
      'paradigms',
    );
    return new ApiResponse('Paradigms count obtained successfully', payload);
  }

  @Get('patterns/count')
  async getPatternsCount() {
    const payload = await this.proProfilesService.getTechnologyCount(
      patterns,
      'patterns',
    );
    return new ApiResponse('Patterns count obtained successfully', payload);
  }

  @Get('english/count')
  async getRequireEnglishCount() {
    const payload = await this.proProfilesService.getEnglishCount();
    return new ApiResponse('English count obtained successfully', payload);
  }

  @Delete(':profileId')
  @UseGuards(JwtAuthGuard)
  async remove(
    @CurrentUser() user: User,
    @Param('profileId') profileId: string,
  ) {
    await this.proProfilesService.remove(user, profileId);

    return new ApiResponse('Professional profile deleted successfully');
  }
}
