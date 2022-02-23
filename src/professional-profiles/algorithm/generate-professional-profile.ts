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
  const {
    languagesDict,
    frameworksDict,
    librariesDict,
    databasesDict,
    patternsDict,
    toolsDict,
    requireEnglish,
  } = await scrapJobs(page, jobLinks);

  console.log('languages:', languagesDict);
  console.log('frameworks:', frameworksDict);
  console.log('libraries:', librariesDict);
  console.log('databases:', databasesDict);
  console.log('patterns:', patternsDict);
  console.log('tools:', toolsDict);

  await browser.close();

  return new ProfessionalProfile({
    languages: getMostDemanded(languagesDict, languagesMaxLength),
    frameworks: getMostDemanded(frameworksDict),
    libraries: getMostDemanded(librariesDict),
    databases: getMostDemanded(databasesDict),
    patterns: getMostDemanded(patternsDict),
    tools: getMostDemanded(toolsDict),
    requireEnglish,
  });
}

/**
 *
 * @param techDict - diccionario (objeto) de las tecnologías en estructura clave: valor
 * @param maxLength - máximo de tecnologías a retornar
 * @returns un arreglo de las tecnologías más demandadas (de las más repetida a la menos repetida)
 */
function getMostDemanded(techDict: TechDictionary, maxLength = 4): string[] {
  const technologiesOrdered = Object.keys(techDict)
    // is different to zero
    .filter((technology) => techDict[technology] !== 0)
    // order max to min
    .sort((a, b) => techDict[b] - techDict[a]);
  // slice only the first X technologies
  return technologiesOrdered.slice(0, maxLength);
}
