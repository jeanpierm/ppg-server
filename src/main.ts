import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { AppConfig } from './config/app.config';
import { DatabaseConfig } from './config/database.config';
import { OpenApiConfig } from './config/open-api.config';
import { ProfessionalProfileResponse } from './professional-profiles/dto/professional-profile-response.dto';
import { ApiResponse } from './shared/dto/api-response.dto';
import { TechnologyResponse } from './technologies/dto/technology-response.dto';
import { UserResponse } from './users/dto/user-response.dto';

async function bootstrap() {
  const context = 'PPGApplication';
  const logger = new Logger(context);
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

  setupOpenApi(app);

  const server = await app.listen(appConfig.http.port, appConfig.http.host);
  if (process.env.NODE_ENV === 'production')
    server.setTimeout(appConfig.timeout);

  logger.debug(`Server environment set to ${appConfig.env}`);
  logger.log(`Database running on ${dbConfig.host}/${dbConfig.name}`);
  logger.log(`Server running on ${await app.getUrl()}`);
}
bootstrap();

/**
 * Setup config for OpenAPI Swagger
 * @param app NestJS application
 */
function setupOpenApi(app: INestApplication) {
  const configService = app.get(ConfigService);
  const openAPIConfig = configService.get<OpenApiConfig>('open-api');
  const appConfig = configService.get<AppConfig>('app');

  const config = new DocumentBuilder()
    .setTitle(openAPIConfig.title)
    .setDescription(openAPIConfig.description)
    .setVersion(openAPIConfig.version)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [
      ApiResponse,
      UserResponse,
      ProfessionalProfileResponse,
      TechnologyResponse,
    ],
  });
  const options: SwaggerCustomOptions = {
    swaggerOptions: {
      filter: true,
      showRequestDuration: true,
    },
  };
  SwaggerModule.setup(`${appConfig.globalPrefix}`, app, document, options);
}
