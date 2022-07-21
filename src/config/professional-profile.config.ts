import { registerAs } from '@nestjs/config';

export interface ProfessionalProfileConfig {
  numberOfTechnologiesByType: number;
}

export default registerAs(
  'professional-profile',
  (): ProfessionalProfileConfig => ({
    numberOfTechnologiesByType:
      +process.env.PP_MAX_NUMBER_OF_TECHNOLOGIES_BY_TYPE || 4,
  }),
);
