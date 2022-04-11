import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TechnologiesModule } from 'src/technologies/technologies.module';
import { ProfessionalProfileGenerator } from './ppg-algorithm/ppg';
import { ProfessionalProfilesController } from './professional-profiles.controller';
import { ProfessionalProfilesService } from './professional-profiles.service';
import {
  EnglishMetadata,
  EnglishMetadataSchema,
  EnglishName,
} from './schemas/english-metadata.schema';
import {
  ProfessionalProfile,
  ProfessionalProfileName,
  ProfessionalProfileSchema,
} from './schemas/professional-profile.schema';
import {
  TechnologyMetadata,
  TechnologyMetadataName,
  TechnologyMetadataSchema,
} from './schemas/technology-metadata.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ProfessionalProfile.name,
        schema: ProfessionalProfileSchema,
        collection: ProfessionalProfileName,
      },
      {
        name: TechnologyMetadata.name,
        schema: TechnologyMetadataSchema,
        collection: TechnologyMetadataName,
      },
      {
        name: EnglishMetadata.name,
        schema: EnglishMetadataSchema,
        collection: EnglishName,
      },
    ]),
    TechnologiesModule,
  ],
  controllers: [ProfessionalProfilesController],
  providers: [ProfessionalProfilesService, ProfessionalProfileGenerator],
})
export class ProfessionalProfilesModule {}
