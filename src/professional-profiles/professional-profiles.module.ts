import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TechnologiesModule } from 'src/technologies/technologies.module';
import { ValidateProfileIsActiveMiddleware } from './middlewares/validate-profile-is-active.middleware';
import { ProfessionalProfileGenerator } from './algorithm/main';
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
import { Job, JobSchema } from './schemas/job.schema';
import { DownloadPreferencesModule } from 'src/download-preferences/download-preferences.module';

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
      {
        name: Job.name,
        schema: JobSchema,
      },
    ]),
    TechnologiesModule,
    DownloadPreferencesModule,
  ],
  controllers: [ProfessionalProfilesController],
  providers: [ProfessionalProfilesService, ProfessionalProfileGenerator],
  exports: [
    ProfessionalProfilesService,
    MongooseModule.forFeature([
      { name: ProfessionalProfile.name, schema: ProfessionalProfileSchema },
    ]),
  ],
})
export class ProfessionalProfilesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ValidateProfileIsActiveMiddleware).forRoutes(
      {
        path: 'professional-profiles/download/:ppId',
        method: RequestMethod.GET,
      },
      {
        path: 'professional-profiles/:ppId',
        method: RequestMethod.GET,
      },
      {
        path: 'professional-profiles/:ppId',
        method: RequestMethod.PATCH,
      },
    );
  }
}
