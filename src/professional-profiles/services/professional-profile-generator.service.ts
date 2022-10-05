import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Technology,
  TechnologyDocument,
} from 'src/technologies/schemas/technology.schema';
import { TechnologiesService } from 'src/technologies/technologies.service';
import { User } from 'src/users/schemas/user.schema';
import { ProfessionalProfileConfig } from '../../config/professional-profile.config';
import { LinkedInScraperService } from '../../core/services/linkedin-scraper.service';
import { TechTypesService } from '../../tech-types/tech-types.service';
import { CreateProfessionalProfile } from '../dto/create-professional-profile.dto';
import { JobIntf } from '../interfaces/job.interface';
import { MIN_PERCENTAGE_TO_REQUIERE_ENGLISH } from '../professional-profile.constant';
import {
  EnglishMetadata,
  EnglishMetadataDocument,
} from '../schemas/english-metadata.schema';
import { Job, JobDocument } from '../schemas/job.schema';
import {
  TechnologyMetadata,
  TechnologyMetadataDocument,
} from '../schemas/technology-metadata.schema';
import { getKeysSortedByHigherValue } from '../utils';

@Injectable()
export class ProfessionalProfileGeneratorService {
  private readonly logger = new Logger(
    ProfessionalProfileGeneratorService.name,
  );
  private readonly config = this.configService.get<ProfessionalProfileConfig>(
    'professional-profile',
  );

  constructor(
    @InjectModel(TechnologyMetadata.name)
    private readonly technologyMetadataModel: Model<TechnologyMetadataDocument>,
    @InjectModel(EnglishMetadata.name)
    private readonly englishMetadataModel: Model<EnglishMetadataDocument>,
    @InjectModel(Job.name)
    private readonly jobModel: Model<JobDocument>,
    private readonly technologiesService: TechnologiesService,
    private readonly techTypesService: TechTypesService,
    private readonly configService: ConfigService,
    private readonly linkedInScrapper: LinkedInScraperService,
  ) {}

  /**
   * PPG (Professional Profile Generator) core algorithm (Web Scraping & I.A.)
   *
   * Implementa un algoritmo de web scraping el cual:
   *  - Extrae la descripción del trabajo.
   *  - Cuenta las tecnologías o herramientas de desarrollo de software que se mencionan en la descripción.
   *  - Cuenta las ofertas de trabajo que requieren ingles
   *  - Genera el perfil profesional con los metadatos obtenidos
   *
   * @param user - user creator of profile
   * @param jobTitle - the job title keyword used to find jobs
   * @param location - the location where job offers will be sought
   * @returns a professional software development profile highly in demand according to the jobs on LinkedIn and the established parameters.
   */
  async generate(
    user: User,
    jobTitle: string,
    location: string,
  ): Promise<CreateProfessionalProfile> {
    const jobs = await this.linkedInScrapper.getJobs(jobTitle, location);
    const jobsAnalyzed = await this.saveJobs(jobs);
    const jobsCount = jobs.length;
    const jobDetails = jobs.map(({ detail, title }, i) => {
      const detailNormalized = this.normalizeJobDetail(detail);
      const finalDetail = `${title} ${detailNormalized}`;
      console.log(`[Job ${i}] details: ${finalDetail}`);
      return finalDetail;
    });
    const technologyTypes = await this.techTypesService.findActives();
    const technologiesMostDemanded: TechnologyDocument[] = [];

    for (const type of technologyTypes) {
      const technologiesByType: TechnologyDocument[] =
        await this.technologiesService.findByType(type.name);
      const countResultByType: Record<string, number> = this.countTechnologies(
        technologiesByType,
        jobDetails,
      );
      console.log(
        `Mapa resultante de tecnologías de tipo ${type.name}:`,
        countResultByType,
      );
      const technologiesMostDemandedByType =
        await this.getTechnologiesMostDemanded(countResultByType);
      technologiesMostDemanded.push(...technologiesMostDemandedByType);

      // persist technologies metadata in db
      this.saveTechnologiesMetadata({
        type: type.name,
        jobTitle,
        location,
        jobsCount,
        countResult: countResultByType,
      });
    }

    const requireEnglishCount = this.countRequireEnglish(jobDetails);
    const requireEnglish = this.calculateRequireEnglish(
      requireEnglishCount,
      jobsCount,
    );
    const professionalProfile: CreateProfessionalProfile = {
      jobTitle,
      location,
      ownerId: user._id,
      jobsAnalyzedIds: jobsAnalyzed.map((job) => job._id),
      technologiesIds: technologiesMostDemanded.map((tech) => tech._id),
      requireEnglish,
    };

    // persist english metadata in db
    this.saveEnglishMetadata({
      jobTitle,
      location,
      jobsCount,
      requireCount: requireEnglishCount,
    });

    return professionalProfile;
  }

  private async getTechnologiesMostDemanded(
    countResult: Record<string, number>,
  ): Promise<TechnologyDocument[]> {
    const techNamesMostDemandedByType: string[] = getKeysSortedByHigherValue(
      countResult,
    ).slice(0, this.config.numberOfTechnologiesByType); // ["java", "python", "javascript"]
    const technologiesMostDemandedByType: TechnologyDocument[] =
      await Promise.all(
        techNamesMostDemandedByType.map((name) =>
          this.technologiesService.findByName(name),
        ),
      );
    return technologiesMostDemandedByType;
  }

  /**
   * @param englishCount
   * @param jobsCount
   * @returns un booleano que indica si se quiere o no inglés, según la mayoría de las ofertas laborales.
   */
  private calculateRequireEnglish(
    englishCount: number,
    jobsCount: number,
  ): boolean {
    const require: boolean =
      englishCount > jobsCount * MIN_PERCENTAGE_TO_REQUIERE_ENGLISH;
    console.log(
      `[RequiereEnglish] ${englishCount}/${jobsCount} jobs require english`,
      require,
    );
    return require;
  }

  private saveJobs(jobs: JobIntf[]) {
    return this.jobModel.create(jobs);
  }

  private saveEnglishMetadata(englishMetadata: EnglishMetadata) {
    this.englishMetadataModel.create(englishMetadata);
  }

  private saveTechnologiesMetadata(technologyMetadata: TechnologyMetadata) {
    this.technologyMetadataModel.create(technologyMetadata);
  }

  /**
   * Añade 1 al contador si se encuentra a una tecnología de desarrollo de software en la descripción de la oferta trabajo.
   *
   * Solo añade 1 por oferta de trabajo (sin importar las veces que se repita en la misma descripción).
   */
  private countTechnologies(
    technologies: Technology[],
    jobDetails: string[],
  ): Record<string, number> {
    const countDictionary: Record<string, number> = {};
    for (const [jobIndex, jobDetail] of jobDetails.entries()) {
      for (const { type, name, identifiers } of technologies) {
        if (countDictionary[name] === undefined) {
          countDictionary[name] = 0;
        }
        for (const identifier of identifiers) {
          const possibleCases = [
            ` ${identifier} `,
            ` ${identifier}.`,
            `.${identifier} `,
            ` ${identifier}/`,
            `/${identifier} `,
          ];
          const jobIncludesTechnology = possibleCases.some((possibleCase) =>
            jobDetail.includes(possibleCase),
          );
          if (jobIncludesTechnology) {
            ++countDictionary[name];
            console.log(
              `[Job ${jobIndex + 1}] ${type.name} "${name}" found! (count: ${
                countDictionary[name]
              })`,
            );
            break;
          }
        }
      }
      console.debug(`[Job ${jobIndex + 1}] finished scraping`);
    }
    return countDictionary;
  }

  private countRequireEnglish(jobDetails: string[]): number {
    let requiereCounter = 0;
    const requireEnglish = [
      'advanced english',
      'advanced fluent english',
      'english language proficiency',
      'fluent english',
      'inglés avanzado',
      'require english',
      'requirements english',
    ];
    for (const [jobIndex, jobDetail] of jobDetails.entries()) {
      for (const englishName of requireEnglish) {
        if (jobDetail.includes(englishName)) {
          ++requiereCounter;
          console.log(`[Job ${jobIndex + 1}] require english`);
          break;
        }
      }
    }
    return requiereCounter;
  }

  /**
   * @param jobDetail
   * @returns elimina caracteres y espacios innecesarios o que puedan perjudicar la integridad del web scrapping.
   */
  private normalizeJobDetail(jobDetail: string): string {
    return jobDetail
      .toLowerCase()
      .replace(/[(),;:]/g, ' ')
      .replace(/\s+/g, ' ');
  }
}
