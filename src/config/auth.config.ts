import { registerAs } from '@nestjs/config';

export interface AuthConfig {
  jwt: {
    secretKey: string;
    expirationTime: string;
  };
}

export default registerAs(
  'auth',
  (): AuthConfig => ({
    jwt: {
      secretKey: process.env.JWT_SECRET_KEY,
      expirationTime: process.env.JWT_EXPIRATION_TIME || '6h',
    },
  }),
);
