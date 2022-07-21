import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import Configs from './config/index';
import { DatabaseModule } from './database/database.module';
import { DatabaseService } from './database/database.service';
import { DownloadPreferencesModule } from './download-preferences/download-preferences.module';
import { ProfessionalProfilesModule } from './professional-profiles/professional-profiles.module';
import { RolesModule } from './roles/roles.module';
import { TechTypesModule } from './tech-types/tech-types.module';
import { TechnologiesModule } from './technologies/technologies.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: Configs,
      isGlobal: true,
      validationSchema: Joi.object({
        EMAIL_USER: Joi.required(),
        EMAIL_PASSWORD: Joi.required(),
        LINKEDIN_USER: Joi.required(),
        LINKEDIN_PASSWORD: Joi.required(),
        JWT_SECRET_KEY: Joi.required(),
      }),
    }),
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
