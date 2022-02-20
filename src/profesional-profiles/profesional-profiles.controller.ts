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
import { ProfesionalProfileResponse } from './dto/profesional-profile-response.dto';
import { ProfesionalProfilesMapper } from './mapper/profesional-profiles.mapper';
import { ProfesionalProfilesService } from './profesional-profiles.service';

@Controller('profesional-profiles')
export class ProfesionalProfilesController {
  constructor(
    private readonly proProfilesService: ProfesionalProfilesService,
    private readonly proProfilesMapper: ProfesionalProfilesMapper,
  ) {}

  // TODO
  @Post()
  @UseGuards(JwtAuthGuard)
  async generate(@CurrentUser() user: User) {
    return this.proProfilesService.generate(user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async get(
    @CurrentUser() user: User,
  ): Promise<ApiResponse<ProfesionalProfileResponse[]>> {
    const profiles = await this.proProfilesService.get(user);
    const payload = profiles.map((profile) =>
      this.proProfilesMapper.mapToProfesionalProfileResponse(profile),
    );

    return new ApiResponse(
      'Profesional profiles obtained successfully',
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
