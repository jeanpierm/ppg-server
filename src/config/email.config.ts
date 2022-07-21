import { registerAs } from '@nestjs/config';

export interface EmailConfig {
  account: Account;
  service: string;
  smtp: SMTP;
}

interface Account {
  user: string;
  pass: string;
}

interface SMTP {
  host: string;
  secure: boolean;
  port: number;
}

export default registerAs('email', (): EmailConfig => {
  return {
    account: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    service: process.env.EMAIL_SERVICE || 'outlook',
    smtp: {
      host: process.env.EMAIL_HOST,
      secure: process.env.EMAIL_SECURE === 'true',
      port: +process.env.EMAIL_PORT || 587,
    },
  };
});
