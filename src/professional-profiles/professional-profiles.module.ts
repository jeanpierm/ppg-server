import { Module } from '@nestjs/common';
import { ProfesionalProfilesService } from './professional-profiles.service';
import { ProfesionalProfilesController } from './professional-profiles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProfessionalProfile,
  ProfessionalProfileName,
  ProfessionalProfileSchema,
} from './schemas/professional-profile.schema';
import { ProfesionalProfilesMapper } from './mapper/professional-profiles.mapper';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ProfessionalProfile.name,
        schema: ProfessionalProfileSchema,
        collection: ProfessionalProfileName,
      },
    ]),
  ],
  controllers: [ProfesionalProfilesController],
  providers: [ProfesionalProfilesService, ProfesionalProfilesMapper],
})
export class ProfesionalProfilesModule {}
