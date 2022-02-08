import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/users/schemas/users.schema';
import { ProfesionalProfilesService } from './profesional-profiles.service';

@Controller('profesional-profiles')
export class ProfesionalProfilesController {
  constructor(
    private readonly proProfilesService: ProfesionalProfilesService,
  ) {}

  // TODO
  @Post()
  @UseGuards(JwtAuthGuard)
  async generate(@CurrentUser() user: User) {
    return this.proProfilesService.generate(user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async get(@CurrentUser() user: User) {
    return this.proProfilesService.get(user);
  }
}
