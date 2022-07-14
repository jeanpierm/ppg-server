import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import Configs from './config/index';
import { DatabaseService } from './database/database.service';
import { DatabaseModule } from './database/database.module';
import { AccountModule } from './account/account.module';
import { ProfessionalProfilesModule } from './professional-profiles/professional-profiles.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/roles.guard';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { TechnologiesModule } from './technologies/technologies.module';
import { RolesModule } from './roles/roles.module';
import { DownloadPreferencesModule } from './download-preferences/download-preferences.module';
import { TechTypesModule } from './tech-types/tech-types.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: Configs, isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [DatabaseModule],
      inject: [DatabaseService],
      useFactory: (databaseService: DatabaseService) =>
        databaseService.createMongooseOptions(),
    }),
    UsersModule,
    AuthModule,
    AccountModule,
    ProfessionalProfilesModule,
    TechnologiesModule,
    RolesModule,
    DownloadPreferencesModule,
    TechTypesModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
