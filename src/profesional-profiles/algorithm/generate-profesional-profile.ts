import { Injectable } from '@nestjs/common';
import { EntityStatus } from 'src/shared/enums/status.enum';
import { User } from 'src/users/schemas/users.schema';
import { ProfesionalProfile } from '../schemas/profesional-profile.schema';

@Injectable()
export class GenerateProfesionalProfile {
  execute(user: User): ProfesionalProfile {
    return {
      languages: ['Java', 'TypeScript', 'JavaScript'],
      frameworks: ['Spring Boot', 'Angular'],
      databases: ['PostgreSQL', 'MySQL', 'MongoDB'],
      patterns: ['REST'],
      tools: ['Git', 'Docker'],
      requireEnglish: true,
      requireTitle: false,
      owner: user,
      status: EntityStatus.ACTIVE,
    };
  }
}
