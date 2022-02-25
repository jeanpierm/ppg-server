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
import { PaginationQuery } from 'src/shared/dto/pagination-query.dto';
import { User } from 'src/users/schemas/users.schema';
import { GeneratePpgDto } from './dto/generate-ppg.dto';
import { ProfessionalProfileResponse } from './dto/professional-profile-response.dto';
import { ProfessionalProfilesMapper } from './mapper/professional-profiles.mapper';
import { ProfessionalProfilesService } from './professional-profiles.service';

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
    @Query() { skip, limit }: PaginationQuery,
    @CurrentUser() user: User,
  ): Promise<ApiResponse<ProfessionalProfileResponse[]>> {
    const profiles = await this.proProfilesService.getSortedByCreatedDateAsc(
      user,
      skip,
      limit,
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
