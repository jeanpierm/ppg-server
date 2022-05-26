import { registerAs } from '@nestjs/config';

export interface OpenApiConfig {
  title: string;
  description: string;
  version: string;
}

export default registerAs(
  'open-api',
  (): OpenApiConfig => ({
    title: 'PPG API RESTful',
    description:
      'Professional Profile Generator (PPG) es una plataforma que permite generar perfiles profesionales ideales, identificando las tecnologías más demandadas por las empresas en tiempo real, a través de web scraping y procesamiento de datos. \n\nEste componente (PPG-SERVER) es el backend de la plataforma, proveyendo diversas APIs RESTful para la comunicación con el cliente.',
    version: '0.0.1',
  }),
);
