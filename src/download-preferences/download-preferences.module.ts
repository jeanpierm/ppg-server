import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfessionalProfilesModule } from 'src/professional-profiles/professional-profiles.module';
import { DownloadPreferencesController } from './download-preferences.controller';
import { DownloadPreferencesService } from './download-preferences.service';
import { PdfResumeMaker } from './pdf/resume';
import {
  DownloadPreferences,
  DownloadPreferencesSchema,
} from './schema/download-preferences.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DownloadPreferences.name, schema: DownloadPreferencesSchema },
    ]),
    ProfessionalProfilesModule,
  ],
  controllers: [DownloadPreferencesController],
  providers: [DownloadPreferencesService, PdfResumeMaker],
  exports: [
    DownloadPreferencesService,
    MongooseModule.forFeature([
      { name: DownloadPreferences.name, schema: DownloadPreferencesSchema },
    ]),
  ],
})
export class DownloadPreferencesModule {}
