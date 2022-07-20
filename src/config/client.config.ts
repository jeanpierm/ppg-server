import { registerAs } from '@nestjs/config';

export interface ClientConfig {
  baseUrl: string;
  passwordResetPath: string;
}

export default registerAs(
  'client',
  (): ClientConfig => ({
    baseUrl: process.env.APP_CLIENT_URL || 'http://localhost:4200',
    passwordResetPath:
      process.env.APP_CLIENT_PASSWORD_RESET || '/password-reset',
  }),
);
