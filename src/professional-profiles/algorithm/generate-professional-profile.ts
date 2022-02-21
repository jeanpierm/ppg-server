import puppeteer = require('puppeteer');
import { ProfessionalProfile } from '../schemas/professional-profile.schema';
import { login } from './login.algorithm';
import { scrapJobLinks } from './scrap-job-links';
import { scrapJobs as scrapJobs } from './scrap-jobs';
import { searchJobs } from './search-jobs';
import { TechDictionary } from './types';

const jobTitle = 'Backend Developer';
const location = 'Guayaquil, Guayas, Ecuador';

const languagesMaxLength = 3;

export async function generateProfessionalProfile() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 2400, height: 1080 });

  await login(page);
  await searchJobs(page, jobTitle, location);
  const jobLinks = await scrapJobLinks(page);
  const [languages, frameworks, libraries, databases, patterns, tools] =
    await scrapJobs(page, jobLinks);

  console.log('languages:', languages);
  console.log('frameworks:', frameworks);
  console.log('libraries:', libraries);
  console.log('databases:', databases);
  console.log('patterns:', patterns);
  console.log('tools:', tools);

  await browser.close();

  return new ProfessionalProfile({
    languages: getMostPopulars(languages, languagesMaxLength),
    frameworks: getMostPopulars(frameworks),
    libraries: getMostPopulars(libraries),
    databases: getMostPopulars(databases),
    patterns: getMostPopulars(patterns),
    tools: getMostPopulars(tools),
  });
}

/**
 *
 * @param techDict - diccionario (objeto) de las tecnologías en estructura clave: valor
 * @param maxLength - máximo de tecnologías a retornar
 * @returns un arreglo de las tecnologías más populares (de las más repetida a la menos repetida)
 */
function getMostPopulars(techDict: TechDictionary, maxLength = 4): string[] {
  const technologiesOrdered = Object.keys(techDict)
    // is different to zero
    .filter((technology) => techDict[technology] !== 0)
    // order max to min
    .sort((a, b) => techDict[b] - techDict[a]);
  // slice only the first X technologies
  return technologiesOrdered.slice(0, maxLength);
}
