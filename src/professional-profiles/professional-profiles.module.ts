import { Module } from '@nestjs/common';
import { ProfessionalProfilesService } from './professional-profiles.service';
import { ProfessionalProfilesController } from './professional-profiles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProfessionalProfile,
  ProfessionalProfileName,
  ProfessionalProfileSchema,
} from './schemas/professional-profile.schema';
import { ProfessionalProfilesMapper } from './mapper/professional-profiles.mapper';

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
  controllers: [ProfessionalProfilesController],
  providers: [ProfessionalProfilesService, ProfessionalProfilesMapper],
})
export class ProfessionalProfilesModule {}
