import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { AppConfig } from './config/app.config';
import { DatabaseConfig } from './config/database.config';

async function bootstrap() {
  const context = 'PPGApplication';
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('app');
  const dbConfig = configService.get<DatabaseConfig>('database');

  app.enableCors();
  app.setGlobalPrefix(appConfig.globalPrefix);
  // allow validate body requests (DTOs) with validation decorators
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  // allow inject dependencies in custom validation decorators
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const server = await app.listen(appConfig.http.port, appConfig.http.host);
  if (process.env.NODE_ENV === 'production') server.setTimeout(appConfig.timeout);

  logger.debug(`Server environment set to ${appConfig.env}`, context);
  logger.log(`Database running on ${dbConfig.host}/${dbConfig.name}`, context);
  logger.log(`Server running on ${await app.getUrl()}`, context);
}
bootstrap();
