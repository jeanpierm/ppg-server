import { Module } from '@nestjs/common';
import { ProfesionalProfilesService } from './profesional-profiles.service';
import { ProfesionalProfilesController } from './profesional-profiles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProfesionalProfile,
  ProProfileSchema,
} from './schemas/profesional-profile.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProfesionalProfile.name, schema: ProProfileSchema },
    ]),
  ],
  controllers: [ProfesionalProfilesController],
  providers: [ProfesionalProfilesService],
})
export class ProfesionalProfilesModule {}
