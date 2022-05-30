import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Technology } from 'src/technologies/schemas/technology.schema';
import { TechnologiesService } from 'src/technologies/technologies.service';
import { User } from 'src/users/schemas/user.schema';
import { TechType } from '../enums/tech-type.enum';
import { ProfessionalProfileIntf } from '../interfaces/professional-profile.interface';
import { ProfessionalProfileBuilder } from '../professional-profile.builder';
import { EnglishMetadata } from '../schemas/english-metadata.schema';
import { TechnologyMetadata } from '../schemas/technology-metadata.schema';
import { countRequireEnglish } from './count-requiere-english';
import { countTechnology as countTechnologies } from './count-technology';
import { extractJobDetail } from './extract-job-detail';
import { login } from './login.algorithm';
import { scrapJobLinks } from './scrap-job-links';
import { searchJobs } from './search-jobs';
import puppeteer = require('puppeteer');

const PPG_ALGORITHM_LABEL = 'PPG ALGORITHM';

@Injectable()
export class ProfessionalProfileGenerator {
  private readonly logger = new Logger(ProfessionalProfileGenerator.name);

  constructor(
    @InjectModel(TechnologyMetadata.name)
    private readonly technologyMetadataModel: Model<TechnologyMetadata>,
    @InjectModel(EnglishMetadata.name)
    private readonly englishMetadataModel: Model<EnglishMetadata>,
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
  async executeAlgorithm(
    user: User,
    jobTitle: string,
    location: string,
  ): Promise<ProfessionalProfileIntf> {
    console.time(PPG_ALGORITHM_LABEL);
    const technologiesCountMap = new Map<TechType, Record<string, number>>();

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await setLanguageInEnglish(page);
    await page.setViewport({ width: 1920, height: 2400 });

    await login(page);
    await searchJobs(page, jobTitle, location);
    const jobLinks: string[] = await scrapJobLinks(page);
    const jobsCount: number = jobLinks.length;

    const jobDetails: string[] = await extractJobDetails(jobLinks, page);

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

    await browser.close();

    // persist metadata in database
    this.saveTechnologiesMetadata(
      technologiesCountMap,
      jobTitle,
      location,
      jobLinks.length,
    );
    this.saveEnglishMetadata(englishCount, jobsCount, jobTitle, location);

    const professionalProfile = new ProfessionalProfileBuilder()
      .jobTitle(jobTitle)
      .location(location)
      .owner(user)
      .requireEnglish(englishCount, jobsCount)
      .technologiesCountMap(technologiesCountMap)
      .build();

    console.timeEnd(PPG_ALGORITHM_LABEL);

    return professionalProfile;
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

async function extractJobDetails(jobLinks: string[], page: puppeteer.Page) {
  const jobDetails: string[] = [];
  for (const [index, jobLink] of jobLinks.entries()) {
    try {
      const detail = await extractJobDetail(page, jobLink, index);
      jobDetails.push(detail);
    } catch (err) {
      console.error(
        `Ocurrió un error mientras se extraía el detalle del trabajo #${index} con link "${jobLink}"`,
        err,
      );
    }
  }
  console.log('Job details extracted successfully');
  return jobDetails;
}

async function setLanguageInEnglish(page: puppeteer.Page) {
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en',
  });
}
