import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Technology } from 'src/technologies/schemas/technology.schema';
import { TechnologiesService } from 'src/technologies/technologies.service';
import { UserDocument } from 'src/users/schemas/user.schema';
import { TechType } from '../enums/tech-type.enum';
import { ProfessionalProfileIntf } from '../interfaces/professional-profile.interface';
import { ProfessionalProfileBuilder } from '../professional-profile.builder';
import {
  EnglishMetadata,
  EnglishMetadataDocument,
} from '../schemas/english-metadata.schema';
import {
  TechnologyMetadata,
  TechnologyMetadataDocument,
} from '../schemas/technology-metadata.schema';
import { countRequireEnglish } from './count-requiere-english';
import { countTechnology as countTechnologies } from './count-technology';
import { extractJobMetadata } from './extract-job';
import { login } from './login.algorithm';
import { scrapJobLinks } from './scrap-job-links';
import { searchJobs } from './search-jobs';
import puppeteer = require('puppeteer');
import { JobIntf } from '../interfaces/job.interface';
import { Job, JobDocument } from '../schemas/job.schema';
import { normalizeJobDetail } from './normalize-job-detail';

const PPG_ALGORITHM_LABEL = 'PPG ALGORITHM';

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
  ): Promise<ProfessionalProfileIntf> {
    console.time(PPG_ALGORITHM_LABEL);
    const technologiesCountMap = new Map<TechType, Record<string, number>>();

    /* JOBS SCRAPING */
    const jobs = await this.scrapeWebJobOffers(jobTitle, location);
    const jobsAnalyzed = await this.saveJobs(jobs);

    /* PROFESSIONAL PROFILE GENERATION */
    const jobsCount = jobs.length;
    const jobDetails = jobs.map(({ detail, title }) => {
      const detailNormalized = normalizeJobDetail(detail);
      return `${title} ${detailNormalized}`;
    });
    console.log('Job details normalized: ', jobDetails);
    for (const type of Object.values(TechType)) {
      const technologies: Technology[] =
        await this.technologiesService.findByType(type);
      const countDictionary: Record<string, number> = countTechnologies(
        technologies,
        jobDetails,
      );
      technologiesCountMap.set(type, countDictionary);
      console.log(
        `Mapa resultante de ${type}:`,
        technologiesCountMap.get(type),
      );
    }
    const englishCount = countRequireEnglish(jobDetails);
    const professionalProfile = new ProfessionalProfileBuilder()
      .jobTitle(jobTitle)
      .location(location)
      .owner(user._id)
      .jobsAnalyzed(jobsAnalyzed.map((job) => job._id))
      .requireEnglish(englishCount, jobsCount)
      .technologiesCountMap(technologiesCountMap)
      .build();

    console.timeEnd(PPG_ALGORITHM_LABEL);

    /* PERSIST METADATA IN DATABASE */
    this.saveTechnologiesMetadata(
      technologiesCountMap,
      jobTitle,
      location,
      jobsCount,
    );
    this.saveEnglishMetadata(englishCount, jobsCount, jobTitle, location);

    return professionalProfile;
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

  private saveEnglishMetadata(
    englishCount: number,
    jobsCount: number,
    jobTitle: string,
    location: string,
  ) {
    this.englishMetadataModel.create({
      requireCount: englishCount,
      jobsCount,
      jobTitle,
      location,
    });
  }

  private saveTechnologiesMetadata(
    technologiesCountMap: Map<TechType, Record<string, number>>,
    jobTitle: string,
    location: string,
    jobsCount: number,
  ) {
    // EJEMPLO...
    // const ex = {
    //   professionalProfile: 'objectId',
    //   technologies: {
    //     languages: [
    //       {
    //         name: 'java',
    //         count: 1,
    //       },
    //     ],
    //     frameworks: [
    //       {
    //         name: 'react.js',
    //         count: 1,
    //       }
    //     ],
    //   },
    //   english: {
    //     requiere: 1,
    //     noRequire: 1,
    //   }
    // };

    const metadataArray: TechnologyMetadata[] = Object.values(TechType).map(
      (type): TechnologyMetadata => ({
        jobTitle,
        jobsCount,
        location,
        type: type,
        countResult: technologiesCountMap.get(type),
      }),
    );
    this.technologyMetadataModel.create(metadataArray);
  }
}

async function setLanguageInEnglish(page: puppeteer.Page) {
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en',
  });
}
