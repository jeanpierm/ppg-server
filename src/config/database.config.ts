import { registerAs } from '@nestjs/config';

export interface DatabaseConfig {
  host: string;
  name: string;
  options: string;
}

export default registerAs(
  'database',
  (): DatabaseConfig => ({
    host: process.env.DATABASE_HOST || 'localhost:27017',
    name: process.env.DATABASE_NAME || 'ppg_db',
    options: process.env.DATABASE_OPTIONS,
  }),
);
