import { User } from '../users/schemas/users.schema';
import { TechType } from './enums/tech-type.enum';
import { ProfessionalProfileIntf } from './interfaces/professional-profile.interface';
import {
  PATTERNS_LENGTH,
  MIN_PERCENTAGE_TO_REQUIERE_ENGLISH,
} from './professional-profile.constant';
import { ProfessionalProfile } from './schemas/professional-profile.schema';

export class ProfessionalProfileBuilder {
  private readonly professionalProfile: ProfessionalProfile;

  constructor() {
    this.professionalProfile = new ProfessionalProfile();
  }

  jobTitle(jobTitle: string): ProfessionalProfileBuilder {
    this.professionalProfile.jobTitle = jobTitle;
    return this;
  }

  location(location: string): ProfessionalProfileBuilder {
    this.professionalProfile.location = location;
    return this;
  }

  technologiesCountMap(
    technologiesCountMap: Map<TechType, Record<string, number>>,
  ): ProfessionalProfileBuilder {
    const languages = technologiesCountMap.get(TechType.Language);
    const frameworks = technologiesCountMap.get(TechType.Framework);
    const libraries = technologiesCountMap.get(TechType.Library);
    const databases = technologiesCountMap.get(TechType.Database);
    const patterns = technologiesCountMap.get(TechType.Pattern);
    const paradigms = technologiesCountMap.get(TechType.Paradigm);
    const tools = technologiesCountMap.get(TechType.Tool);
    this.professionalProfile.languages = getMostDemanded(languages);
    this.professionalProfile.frameworks = getMostDemanded(frameworks);
    this.professionalProfile.libraries = getMostDemanded(libraries);
    this.professionalProfile.databases = getMostDemanded(databases);
    this.professionalProfile.patterns = getMostDemanded(patterns, PATTERNS_LENGTH);
    this.professionalProfile.tools = getMostDemanded(tools);
    this.professionalProfile.paradigms = getMostDemanded(paradigms);
    return this;
  }

  owner(owner: User): ProfessionalProfileBuilder {
    this.professionalProfile.owner = owner;
    return this;
  }

  requireEnglish(englishCount: number, jobsCount: number): ProfessionalProfileBuilder {
    this.professionalProfile.requireEnglish = calculateRequireEnglish(englishCount, jobsCount);
    return this;
  }

  build(): ProfessionalProfileIntf {
    return this.professionalProfile;
  }
}

/**
 * @param techDict - diccionario (objeto) de las tecnologías en estructura clave: valor
 * @param maxLength - máximo de tecnologías a retornar
 * @returns un arreglo de las tecnologías más demandadas (de las más repetida a la menos repetida)
 */
function getMostDemanded(techDict: Record<string, number>, maxLength = 3): string[] {
  const technologiesOrdered = Object.keys(techDict)
    // is different to zero
    .filter((technology) => techDict[technology] !== 0)
    // order max to min
    .sort((a, b) => techDict[b] - techDict[a]);
  // slice only the first X technologies
  return technologiesOrdered.slice(0, maxLength);
}

/**
 * @param englishCount
 * @param jobsCount
 * @returns un booleano que indica si se quiere o no inglés, según la mayoría de las ofertas laborales.
 */
function calculateRequireEnglish(englishCount: number, jobsCount: number): boolean {
  console.log(`${englishCount}/${jobsCount} jobs require english`);
  return englishCount > jobsCount * MIN_PERCENTAGE_TO_REQUIERE_ENGLISH;
}
