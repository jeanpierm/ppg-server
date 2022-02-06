import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import Configs from './config/index';
import { DatabaseService } from './database/database.service';
import { DatabaseModule } from './database/database.module';
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
