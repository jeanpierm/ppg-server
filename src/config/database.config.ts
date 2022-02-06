import { registerAs } from '@nestjs/config';

export interface DatabaseConfig {
  host: string;
  name: string;
  user: string;
  password: string;
  srv: boolean;
  options: string;
}

export default registerAs(
  'database',
  (): DatabaseConfig => ({
    host: process.env.DATABASE_HOST || 'localhost:27017',
    name: process.env.DATABASE_NAME || 'ppgDB',
    user: process.env.DATABASE_USER || null,
    password: process.env.DATABASE_PASSWORD || null,
    srv: process.env.DATABASE_SRV === 'true' || false,
    options: process.env.DATABASE_OPTIONS,
  }),
);
