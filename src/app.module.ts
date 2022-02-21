import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import Configs from './config/index';
import { DatabaseService } from './database/database.service';
import { DatabaseModule } from './database/database.module';
import { HelperModule } from './helper/helper.module';
import { AccountModule } from './account/account.module';
import { ProfessionalProfilesModule } from './professional-profiles/professional-profiles.module';
@Module({
  imports: [
    ConfigModule.forRoot({ load: Configs, isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [DatabaseModule],
      inject: [DatabaseService],
      useFactory: (databaseService: DatabaseService) =>
        databaseService.createMongooseOptions(),
    }),
    HelperModule,
    UsersModule,
    AuthModule,
    AccountModule,
    ProfessionalProfilesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
