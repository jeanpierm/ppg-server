import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiResponse } from 'src/shared/dto/api-response.dto';
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
    @CurrentUser() user: User,
  ): Promise<ApiResponse<ProfessionalProfileResponse[]>> {
    const profiles = await this.proProfilesService.get(user);
    const payload = profiles.map((profile) =>
      this.proProfilesMapper.mapToProfessionalProfileResponse(profile),
    );

    return new ApiResponse(
      'Professional profiles obtained successfully',
      payload,
    );
  }

  @Delete(':profileId')
  @UseGuards(JwtAuthGuard)
  async remove(
    @CurrentUser() user: User,
    @Param('profileId') profileId: string,
  ) {
    return this.proProfilesService.remove(user, profileId);
  }
}
