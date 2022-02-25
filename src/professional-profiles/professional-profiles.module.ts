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
import { GenerateProfessionalProfile } from './algorithm/generate-professional-profile';
import {
  Languages,
  LanguagesName,
  LanguagesSchema,
} from './schemas/languages.schema';
import {
  Databases,
  DatabasesName,
  DatabasesSchema,
} from './schemas/databases.schema';
import {
  Frameworks,
  FrameworksName,
  FrameworksSchema,
} from './schemas/frameworks.schema';
import {
  Libraries,
  LibrariesName,
  LibrariesSchema,
} from './schemas/libraries.schema';
import {
  Paradigms,
  ParadigmsName,
  ParadigmsSchema,
} from './schemas/paradigms.schema';
import {
  Patterns,
  PatternsName,
  PatternsSchema,
} from './schemas/patterns.schema';
import {
  RequireEnglishName,
  RequireEnglish,
  RequireEnglishSchema,
} from './schemas/require-english.schema';
import { Tools, ToolsName, ToolsSchema } from './schemas/tools.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ProfessionalProfile.name,
        schema: ProfessionalProfileSchema,
        collection: ProfessionalProfileName,
      },
      {
        name: Databases.name,
        schema: DatabasesSchema,
        collection: DatabasesName,
      },
      {
        name: Frameworks.name,
        schema: FrameworksSchema,
        collection: FrameworksName,
      },
      {
        name: Languages.name,
        schema: LanguagesSchema,
        collection: LanguagesName,
      },
      {
        name: Libraries.name,
        schema: LibrariesSchema,
        collection: LibrariesName,
      },
      {
        name: Paradigms.name,
        schema: ParadigmsSchema,
        collection: ParadigmsName,
      },
      {
        name: Patterns.name,
        schema: PatternsSchema,
        collection: PatternsName,
      },
      {
        name: RequireEnglish.name,
        schema: RequireEnglishSchema,
        collection: RequireEnglishName,
      },
      {
        name: Tools.name,
        schema: ToolsSchema,
        collection: ToolsName,
      },
    ]),
  ],
  controllers: [ProfessionalProfilesController],
  providers: [
    ProfessionalProfilesService,
    ProfessionalProfilesMapper,
    GenerateProfessionalProfile,
  ],
})
export class ProfessionalProfilesModule {}
