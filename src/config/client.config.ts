import { registerAs } from '@nestjs/config';

export interface ClientConfig {
  host?: string;
  protocol?: string;
  passwordResetPath: string;
}

export default registerAs(
  'client',
  (): ClientConfig => ({
    host: process.env.APP_CLIENT_HOST,
    protocol: process.env.APP_CLIENT_PROTOCOL,
    passwordResetPath:
      process.env.APP_CLIENT_PASSWORD_RESET || '/password-reset',
  }),
);
