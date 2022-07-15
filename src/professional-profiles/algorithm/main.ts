import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TechnologyDocument } from 'src/technologies/schemas/technology.schema';
import { TechnologiesService } from 'src/technologies/technologies.service';
import { UserDocument } from 'src/users/schemas/user.schema';
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
import { countRequireEnglish } from './count-requiere-english';
import { countTechnology as countTechnologies } from './count-technology';
import { extractJobMetadata } from './extract-job';
import { login } from './login.algorithm';
import { normalizeJobDetail } from './normalize-job-detail';
import { scrapJobLinks } from './scrap-job-links';
import { searchJobs } from './search-jobs';
import puppeteer = require('puppeteer');
import { getKeysSortedByHigherValue } from './util';

const PPG_ALGORITHM_LABEL = 'PPG ALGORITHM';

const NUMBER_OF_TECHNOLOGIES_BY_TYPE = 4;

@Injectable()
export class ProfessionalProfileGenerator {
  private readonly logger = new Logger(ProfessionalProfileGenerator.name);

  constructor(
    @InjectModel(TechnologyMetadata.name)
    private readonly technologyMetadataModel: Model<TechnologyMetadataDocument>,
    @InjectModel(EnglishMetadata.name)
    private readonly englishMetadataModel: Model<EnglishMetadataDocument>,
    @InjectModel(Job.name)
    private readonly jobModel: Model<JobDocument>,
    private readonly technologiesService: TechnologiesService,
    private readonly techTypesService: TechTypesService,
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
    user: UserDocument,
    jobTitle: string,
    location: string,
  ): Promise<CreateProfessionalProfile> {
    console.time(PPG_ALGORITHM_LABEL);

    const jobs = await this.scrapeWebJobOffers(jobTitle, location);
    const jobsAnalyzed = await this.saveJobs(jobs);
    const jobsCount = jobs.length;
    const jobDetails = jobs.map(({ detail, title }) => {
      const detailNormalized = normalizeJobDetail(detail);
      return `${title} ${detailNormalized}`;
    });
    console.log('Job details normalized: ', jobDetails);

    const technologyTypes = (await this.techTypesService.findAll()).data;
    const technologiesMostDemanded: TechnologyDocument[] = [];

    for (const type of technologyTypes) {
      const technologiesByType: TechnologyDocument[] =
        await this.technologiesService.findByType(type.name);
      const countResultByType: Record<string, number> = countTechnologies(
        technologiesByType,
        jobDetails,
      );
      console.log(
        `Mapa resultante de tecnologías de tipo ${type}:`,
        technologiesByType,
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

    const requireEnglishCount = countRequireEnglish(jobDetails);
    const requireEnglish = calculateRequireEnglish(
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

    console.timeEnd(PPG_ALGORITHM_LABEL);

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
    ).slice(0, NUMBER_OF_TECHNOLOGIES_BY_TYPE);
    const technologiesMostDemandedByType: TechnologyDocument[] =
      await Promise.all(
        techNamesMostDemandedByType.map((name) =>
          this.technologiesService.findByName(name),
        ),
      );
    return technologiesMostDemandedByType;
  }

  private async scrapeWebJobOffers(
    jobTitle: string,
    location: string,
  ): Promise<JobIntf[]> {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await setLanguageInEnglish(page);
    await page.setViewport({ width: 1920, height: 2400 });

    await login(page);
    await searchJobs(page, jobTitle, location);
    const jobLinks = await scrapJobLinks(page);
    const jobs = (
      await Promise.all(
        jobLinks.map((link, i) => extractJobMetadata(browser, link, i)),
      )
    ).filter((job) => job !== undefined);
    await browser.close();

    return jobs;
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
}

async function setLanguageInEnglish(page: puppeteer.Page) {
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en',
  });
}

/**
 * @param englishCount
 * @param jobsCount
 * @returns un booleano que indica si se quiere o no inglés, según la mayoría de las ofertas laborales.
 */
function calculateRequireEnglish(
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
