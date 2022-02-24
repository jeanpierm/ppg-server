import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api-ppg/v1/');
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const server = await app.listen(3000);
  // 90s de timeout para que el algoritmo PPG tenga suficiente tiempo
  server.setTimeout(90_000);
}
bootstrap();
