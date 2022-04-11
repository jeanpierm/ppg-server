import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { GetProfessionalProfilesQuery } from 'src/professional-profiles/dto/get-professional-profiles-query.dto';
import { ApiResponse } from 'src/shared/dto/api-response.dto';
import { User } from 'src/users/schemas/users.schema';
import { GeneratePpgDto } from './dto/generate-ppg.dto';
import { ProfessionalProfileResponse } from './dto/professional-profile-response.dto';
import { TechType } from './enums/tech-type.enum';
import { ProfessionalProfilesMapper } from './mapper/professional-profiles.mapper';
import { ProfessionalProfilesService } from './professional-profiles.service';

@Controller('professional-profiles')
export class ProfessionalProfilesController {
  constructor(private readonly proProfilesService: ProfessionalProfilesService) {}

  @Post()
  @Roles(Role.User, Role.Admin)
  async generate(@CurrentUser() user: User, @Body() generatePpgDto: GeneratePpgDto) {
    const { jobTitle, location } = generatePpgDto;
    const generatedProProfile = await this.proProfilesService.generate(user, jobTitle, location);
    const payload = ProfessionalProfilesMapper.toResponse(generatedProProfile);
    return new ApiResponse('Professional profile generated successfully', payload);
  }

  @Get()
  @Roles(Role.User, Role.Admin)
  async get(
    @Query()
    getQuery: GetProfessionalProfilesQuery,
    @CurrentUser() user: User,
  ): Promise<ApiResponse<ProfessionalProfileResponse[]>> {
    const profiles = await this.proProfilesService.getSortedByCreatedDateAsc(user, getQuery);
    const payload = profiles.map((profile) => ProfessionalProfilesMapper.toResponse(profile));
    return new ApiResponse('Professional profiles obtained successfully', payload);
  }

  @Get('random')
  @Roles(Role.User, Role.Admin)
  async getRandom(): Promise<ApiResponse<ProfessionalProfileResponse>> {
    const profile = await this.proProfilesService.getRandom();
    const payload = ProfessionalProfilesMapper.toResponse(profile);
    return new ApiResponse('Random professional profile obtained successfully', payload);
  }

  @Roles(Role.User, Role.Admin)
  @Get('languages/count')
  async getLanguagesCount(@CurrentUser() user: User) {
    const profiles = await this.proProfilesService.getSortedByCreatedDateAsc(user);
    const payload = await this.proProfilesService.getTechnologyCount(profiles, TechType.Language);
    return new ApiResponse('Languages count obtained successfully', payload);
  }

  @Get('frameworks/count')
  @Roles(Role.User, Role.Admin)
  async getFrameworksCount(@CurrentUser() user: User) {
    const profiles = await this.proProfilesService.getSortedByCreatedDateAsc(user);
    const payload = await this.proProfilesService.getTechnologyCount(profiles, TechType.Framework);
    return new ApiResponse('Frameworks count obtained successfully', payload);
  }

  @Get('databases/count')
  @Roles(Role.User, Role.Admin)
  async getDatabasesCount(@CurrentUser() user: User) {
    const profiles = await this.proProfilesService.getSortedByCreatedDateAsc(user);
    const payload = await this.proProfilesService.getTechnologyCount(profiles, TechType.Database);
    return new ApiResponse('Databases count obtained successfully', payload);
  }

  @Get('tools/count')
  @Roles(Role.User, Role.Admin)
  async getToolsCount(@CurrentUser() user: User) {
    const profiles = await this.proProfilesService.getSortedByCreatedDateAsc(user);
    const payload = await this.proProfilesService.getTechnologyCount(profiles, TechType.Tool);
    return new ApiResponse('Tools count obtained successfully', payload);
  }

  @Get('paradigms/count')
  @Roles(Role.User, Role.Admin)
  async getParadigmsCount(@CurrentUser() user: User) {
    const profiles = await this.proProfilesService.getSortedByCreatedDateAsc(user);
    const payload = await this.proProfilesService.getTechnologyCount(profiles, TechType.Paradigm);
    return new ApiResponse('Paradigms count obtained successfully', payload);
  }

  @Get('patterns/count')
  @Roles(Role.User, Role.Admin)
  async getPatternsCount(@CurrentUser() user: User) {
    const profiles = await this.proProfilesService.getSortedByCreatedDateAsc(user);
    const payload = await this.proProfilesService.getTechnologyCount(profiles, TechType.Pattern);
    return new ApiResponse('Patterns count obtained successfully', payload);
  }

  @Get('english/count')
  @Roles(Role.User, Role.Admin)
  async getRequireEnglishCount(@CurrentUser() user: User) {
    const payload = await this.proProfilesService.getEnglishCount(user);
    return new ApiResponse('English count obtained successfully', payload);
  }

  @Delete(':profileId')
  @Roles(Role.User, Role.Admin)
  async remove(@CurrentUser() user: User, @Param('profileId') profileId: string) {
    await this.proProfilesService.remove(user, profileId);
    return new ApiResponse('Professional profile deleted successfully');
  }
}
