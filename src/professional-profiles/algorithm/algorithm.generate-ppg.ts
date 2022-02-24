import puppeteer = require('puppeteer');
import { User } from 'src/users/schemas/users.schema';
import { patternsLength } from '../identifiers/patterns';
import { ScrapJobsResponse } from '../interfaces/professional-profile.interface';
import { ProfessionalProfile } from '../schemas/professional-profile.schema';
import { TechDictionary } from '../types/professional-profile.type';
import { login } from './login.algorithm';
import { scrapJobLinks } from './scrap-job-links';
import { scrapJobs as scrapJobs } from './scrap-jobs';
import { searchJobs } from './search-jobs';

/**
 * PPG (Professional Profile Generator) core algorithm (Web Scraping & I.A.)
 *
 * @param user - user creator of profile
 * @param jobTitle - the job title keyword used to find jobs
 * @param location - the location where job offers will be sought
 * @returns a professional software development profile highly in demand according to the jobs on LinkedIn and the established parameters.
 */
export async function algorithmGeneratePPG(
  user: User,
  jobTitle: string,
  location: string,
) {
  // ? headless en false hace que se muestre el browser del web scraping
  // const browser = await puppeteer.launch({ headless: false });
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 2400, height: 1080 });

  await login(page);
  await searchJobs(page, jobTitle, location);
  const jobLinks = await scrapJobLinks(page);
  const scrapJobsResponse = await scrapJobs(page, jobLinks);
  await browser.close();

  return buildProfessionalProfile(jobTitle, location, user, scrapJobsResponse);
}

/**
 * Build a professional profile entity with dictionaries
 * @param scrapJobsResponse
 * @returns a professional profile builded
 */
function buildProfessionalProfile(
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
  professionalProfile.languages = getMostDemanded(languagesDict);
  professionalProfile.frameworks = getMostDemanded(frameworksDict);
  professionalProfile.libraries = getMostDemanded(librariesDict);
  professionalProfile.databases = getMostDemanded(databasesDict);
  professionalProfile.patterns = getMostDemanded(patternsDict, patternsLength);
  professionalProfile.tools = getMostDemanded(toolsDict);
  professionalProfile.paradigms = getMostDemanded(paradigmsDict);
  professionalProfile.requireEnglish = requireEnglish;

  return professionalProfile;
}

/**
 * @param techDict - diccionario (objeto) de las tecnologías en estructura clave: valor
 * @param maxLength - máximo de tecnologías a retornar
 * @returns un arreglo de las tecnologías más demandadas (de las más repetida a la menos repetida)
 */
function getMostDemanded(techDict: TechDictionary, maxLength = 3): string[] {
  const technologiesOrdered = Object.keys(techDict)
    // is different to zero
    .filter((technology) => techDict[technology] !== 0)
    // order max to min
    .sort((a, b) => techDict[b] - techDict[a]);
  // slice only the first X technologies
  return technologiesOrdered.slice(0, maxLength);
}
