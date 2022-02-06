import { registerAs } from '@nestjs/config';

export interface AppConfig {
  name: string;
}

export default registerAs(
  'app',
  (): AppConfig => ({ name: 'Profesional Profile Generator' }),
);
