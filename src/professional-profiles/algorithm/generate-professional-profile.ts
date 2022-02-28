import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schemas/users.schema';
import { patternsLength } from '../identifiers/patterns';
import { ScrapJobsResponse } from '../interfaces/professional-profile.interface';
import { Languages, LanguagesDocument } from '../schemas/languages.schema';
import { ProfessionalProfile } from '../schemas/professional-profile.schema';
import { TechDictionary } from '../types/professional-profile.type';
import { login } from './login.algorithm';
import { scrapJobLinks } from './scrap-job-links';
import { scrapJobs as scrapJobs } from './scrap-jobs';
import { searchJobs } from './search-jobs';
import puppeteer = require('puppeteer');
import { Databases, DatabasesDocument } from '../schemas/databases.schema';
import { Frameworks, FrameworksDocument } from '../schemas/frameworks.schema';
import { Libraries, LibrariesDocument } from '../schemas/libraries.schema';
import { Paradigms, ParadigmsDocument } from '../schemas/paradigms.schema';
import { Patterns, PatternsDocument } from '../schemas/patterns.schema';
import {
  RequireEnglish,
  RequireEnglishDocument,
} from '../schemas/require-english.schema';
import { Tools, ToolsDocument } from '../schemas/tools.schema';

@Injectable()
export class GenerateProfessionalProfile {
  private readonly logger = new Logger(GenerateProfessionalProfile.name);

  constructor(
    @InjectModel(Databases.name)
    private readonly databasesModel: Model<DatabasesDocument>,
    @InjectModel(Frameworks.name)
    private readonly frameworksModel: Model<FrameworksDocument>,
    @InjectModel(Languages.name)
    private readonly languagesModel: Model<LanguagesDocument>,
    @InjectModel(Libraries.name)
    private readonly librariesModel: Model<LibrariesDocument>,
    @InjectModel(Paradigms.name)
    private readonly paradigmsModel: Model<ParadigmsDocument>,
    @InjectModel(Patterns.name)
    private readonly patternsModel: Model<PatternsDocument>,
    @InjectModel(RequireEnglish.name)
    private readonly requireEnglishModel: Model<RequireEnglishDocument>,
    @InjectModel(Tools.name)
    private readonly toolsModel: Model<ToolsDocument>,
  ) {}
  /**
   * PPG (Professional Profile Generator) core algorithm (Web Scraping & I.A.)
   *
   * @param user - user creator of profile
   * @param jobTitle - the job title keyword used to find jobs
   * @param location - the location where job offers will be sought
   * @returns a professional software development profile highly in demand according to the jobs on LinkedIn and the established parameters.
   */
  async executeAlgorithm(user: User, jobTitle: string, location: string) {
    // ? headless en false hace que se muestre el browser del web scraping
    // const browser = await puppeteer.launch({ headless: false });
    const browser = await puppeteer.launch({
      args: ['--lang=en-US,en'],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 2400, height: 1080 });

    await login(page);
    await searchJobs(page, jobTitle, location);
    const jobLinks = await scrapJobLinks(page);
    const scrapJobsResponse = await scrapJobs(page, jobLinks);
    await browser.close();

    // persist metadata in database
    this.saveTechnologyMetadata(scrapJobsResponse);

    return this.buildProfessionalProfile(
      jobTitle,
      location,
      user,
      scrapJobsResponse,
    );
  }

  private saveTechnologyMetadata(scrapJobsResponse: ScrapJobsResponse) {
    this.databasesModel.create(scrapJobsResponse.databasesDict).then(() => {
      this.logger.log('Databases metadata saved successfully in database');
    });
    this.frameworksModel.create(scrapJobsResponse.frameworksDict).then(() => {
      this.logger.log('Frameworks metadata saved successfully in database');
    });
    this.languagesModel.create(scrapJobsResponse.languagesDict).then(() => {
      this.logger.log('Languages metadata saved successfully in database');
    });
    this.librariesModel.create(scrapJobsResponse.librariesDict).then(() => {
      this.logger.log('Libraries metadata saved successfully in database');
    });
    this.paradigmsModel.create(scrapJobsResponse.paradigmsDict).then(() => {
      this.logger.log('Paradigms metadata saved successfully in database');
    });
    this.patternsModel.create(scrapJobsResponse.patternsDict).then(() => {
      this.logger.log('Patterns metadata saved successfully in database');
    });
    this.requireEnglishModel
      .create(scrapJobsResponse.requireEnglish)
      .then(() => {
        this.logger.log(
          'Require english metadata saved successfully in database',
        );
      });
    this.toolsModel.create(scrapJobsResponse.toolsDict).then(() => {
      this.logger.log('Tools metadata saved successfully in database');
    });
  }

  /**
   * Build a professional profile entity with dictionaries
   * @param scrapJobsResponse
   * @returns a professional profile builded
   */
  private buildProfessionalProfile(
    jobTitle: string,
    location: string,
    user: User,
    scrapJobsResponse: ScrapJobsResponse,
  ): ProfessionalProfile {
    const {
      languagesDict,
      frameworksDict,
      librariesDict,
      databasesDict,
      patternsDict,
      toolsDict,
      paradigmsDict,
      requireEnglish,
    } = scrapJobsResponse;
    const professionalProfile = new ProfessionalProfile();
    professionalProfile.jobTitle = jobTitle;
    professionalProfile.location = location;
    professionalProfile.owner = user;

    // technologies
    professionalProfile.languages =
      GenerateProfessionalProfile.getMostDemanded(languagesDict);
    professionalProfile.frameworks =
      GenerateProfessionalProfile.getMostDemanded(frameworksDict);
    professionalProfile.libraries =
      GenerateProfessionalProfile.getMostDemanded(librariesDict);
    professionalProfile.databases =
      GenerateProfessionalProfile.getMostDemanded(databasesDict);
    professionalProfile.patterns = GenerateProfessionalProfile.getMostDemanded(
      patternsDict,
      patternsLength,
    );
    professionalProfile.tools =
      GenerateProfessionalProfile.getMostDemanded(toolsDict);
    professionalProfile.paradigms =
      GenerateProfessionalProfile.getMostDemanded(paradigmsDict);
    professionalProfile.requireEnglish =
      GenerateProfessionalProfile.calculateRequireEnglish(
        requireEnglish.requireEnglish,
        requireEnglish.totalJobs,
      );

    return professionalProfile;
  }

  /**
   * @param techDict - diccionario (objeto) de las tecnologías en estructura clave: valor
   * @param maxLength - máximo de tecnologías a retornar
   * @returns un arreglo de las tecnologías más demandadas (de las más repetida a la menos repetida)
   */
  private static getMostDemanded(
    techDict: TechDictionary,
    maxLength = 3,
  ): string[] {
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
  private static calculateRequireEnglish(
    englishCount: number,
    jobsCount: number,
  ): boolean {
    console.log(`${englishCount}/${jobsCount} jobs require english`);
    return englishCount > jobsCount * 0.5;
  }
}
