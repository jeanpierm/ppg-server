import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { DatabaseConfig } from 'src/config/database.config';

@Injectable()
export class DatabaseService implements MongooseOptionsFactory {
  private readonly config: DatabaseConfig;
  private readonly host: string;
  private readonly database: string;
  private readonly options: string;

  constructor(private readonly configService: ConfigService) {
    this.config = this.configService.get<DatabaseConfig>('database');
    this.host = this.config.host;
    this.database = this.config.name;
    this.options = this.config.options ? `?${this.config.options}` : '';
  }

  createMongooseOptions(): MongooseModuleOptions {
    const uri = `mongodb://${this.host}/${this.database}${this.options}`;
    const mongooseOptions: MongooseModuleOptions = {
      uri,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    return mongooseOptions;
  }
}
