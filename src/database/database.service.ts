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
  private readonly user: string;
  private readonly password: string;
  private readonly srv: boolean;
  private readonly options: string;

  constructor(private readonly configService: ConfigService) {
    this.config = this.configService.get<DatabaseConfig>('database');
    this.host = this.config.host;
    this.database = this.config.name;
    this.user = this.config.user;
    this.password = this.config.password;
    this.srv = this.config.srv;
    this.options = this.config.options ? `?${this.config.options}` : '';
  }

  createMongooseOptions(): MongooseModuleOptions {
    const uri = `mongodb${this.srv ? '+srv' : ''}://${this.host}/${
      this.database
    }${this.options}`;

    const mongooseOptions: MongooseModuleOptions = {
      uri,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    if (this.user && this.password) {
      mongooseOptions.auth = {
        username: this.user,
        password: this.password,
      };
    }

    return mongooseOptions;
  }
}
