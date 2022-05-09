import { registerAs } from '@nestjs/config';

interface HttpConfig {
  host: string;
  port: number;
}
export interface AppConfig {
  name: string;
  globalPrefix: string;
  env: string;
  timeout: number;
  language: string;
  http: HttpConfig;
  timezone: string;
}

export default registerAs(
  'app',
  (): AppConfig => ({
    name: process.env.APP_NAME || 'ppg-api',
    globalPrefix: process.env.APP_GLOBAL_PREFIX || 'ppg-api/v1',
    env: process.env.NODE_ENV || 'development',
    timeout: parseInt(process.env.APP_TIMEOUT_IN_MS) || 180_000,
    language: process.env.APP_LANGUAGE || 'es',
    http: {
      host: process.env.HOST || process.env.APP_HOST || '0.0.0.0',
      port: parseInt(process.env.PORT) || parseInt(process.env.APP_PORT) || 3000,
    },
    timezone: process.env.APP_TZ || 'America/Guayaquil',
  }),
);
