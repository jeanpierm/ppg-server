import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DownloadPreferencesController } from './download-preferences.controller';
import { DownloadPreferencesService } from './download-preferences.service';
import {
  DownloadPreferences,
  DownloadPreferencesSchema,
} from './schema/download-preferences.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DownloadPreferences.name, schema: DownloadPreferencesSchema },
    ]),
  ],
  controllers: [DownloadPreferencesController],
  providers: [DownloadPreferencesService],
  exports: [
    DownloadPreferencesService,
    MongooseModule.forFeature([
      { name: DownloadPreferences.name, schema: DownloadPreferencesSchema },
    ]),
  ],
})
export class DownloadPreferencesModule {}
