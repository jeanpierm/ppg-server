import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TechnologiesModule } from 'src/technologies/technologies.module';
import { ValidateProfileIsActiveMiddleware } from './middlewares/validate-profile-is-active.middleware';
import { ProfessionalProfileGeneratorService } from './services/professional-profile-generator.service';
import { ProfessionalProfilesController } from './professional-profiles.controller';
import { ProfessionalProfilesService } from './services/professional-profiles.service';
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
import { TechTypesModule } from '../tech-types/tech-types.module';
import { TemplatesService } from '../core/services/templates.service';
import { LinkedInScrapperService } from '../core/services/linkedin-scrapper.service';

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
    TechTypesModule,
  ],
  controllers: [ProfessionalProfilesController],
  providers: [
    ProfessionalProfilesService,
    ProfessionalProfileGeneratorService,
    TemplatesService,
    LinkedInScrapperService,
  ],
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
      {
        path: 'professional-profiles/:ppId',
        method: RequestMethod.DELETE,
      },
    );
  }
}
