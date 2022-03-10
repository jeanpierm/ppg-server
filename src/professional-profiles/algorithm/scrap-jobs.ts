import puppeteer = require('puppeteer');
import {
  RequireEnglishDict,
  ScrapJobsResponse,
} from '../interfaces/professional-profile.interface';
import { TechCountDictionary } from '../types/professional-profile.type';
import { checkRequireEnglish } from './count-require-english';
import { countTechnologies as countTechnologies } from './count-technologies';
import { waitLoad } from './util';

const jobDetailsSelector = '#job-details';

/**
 * Implementa un algoritmo de web scraping el cual:
 *  - Extrae la descripción del trabajo.
 *  - Cuenta las tecnologías o herramientas de desarrollo de software que se mencionan en la descripción.
 *  - Estructura los datos obtenidos en un diccionarios de datos.
 * @param page
 * @param jobLinks
 * @returns - un objeto de diccionarios de tecnologías, con el número de veces que se repitió esa tecnología.
 */
export async function scrapJobs(
  page: puppeteer.Page,
  jobLinks: string[],
): Promise<ScrapJobsResponse> {
  console.debug('Init scrapping jobs...');

  const languagesDict: TechCountDictionary = {};
  const frameworksDict: TechCountDictionary = {};
  const librariesDict: TechCountDictionary = {};
  const databasesDict: TechCountDictionary = {};
  const patternsDict: TechCountDictionary = {};
  const toolsDict: TechCountDictionary = {};
  const paradigmsDict: TechCountDictionary = {};
  let englishCount = 0;

  for (const [index, link] of jobLinks.entries()) {
    console.debug(`Init scrapping job #${index + 1}...`);
    await page.goto(link, waitLoad);
    await page.waitForSelector(jobDetailsSelector);
    const jobDetail = await getJobDetail(page);
    const jobDetailNormalized = normalizeJobDetail(jobDetail);
    countTechnologies(
      jobDetailNormalized,
      index,
      languagesDict,
      frameworksDict,
      librariesDict,
      databasesDict,
      patternsDict,
      toolsDict,
      paradigmsDict,
    );
    if (checkRequireEnglish(jobDetailNormalized, index)) {
      englishCount++;
    }
    console.debug(`Job #${index + 1} scrapped successfully`);
  }

  const requireEnglishDict: RequireEnglishDict = {
    requireEnglish: englishCount,
    totalJobs: jobLinks.length,
  };

  console.debug('Jobs scrapped successfully');

  console.log('languages:', languagesDict);
  console.log('frameworks:', frameworksDict);
  console.log('libraries:', librariesDict);
  console.log('databases:', databasesDict);
  console.log('patterns:', patternsDict);
  console.log('tools:', toolsDict);
  console.log('require english:', requireEnglishDict);

  return {
    languagesDict,
    frameworksDict,
    librariesDict,
    databasesDict,
    patternsDict,
    toolsDict,
    paradigmsDict,
    requireEnglishDict,
  };
}

/**
 * @param page
 * @returns el título y la descripción de la oferta de trabajo actual.
 */
async function getJobDetail(page: puppeteer.Page): Promise<string> {
  console.log('Init get job detail...');
  const jobDetail = await page.evaluate((selector) => {
    const paragraph: HTMLParagraphElement = document.querySelector(selector);
    const title: HTMLHeadingElement = document.querySelector('h1');
    return ` ${title.innerText} ${paragraph.innerText} `;
  }, jobDetailsSelector);
  console.log('Job detail obtained successfully');
  return jobDetail;
}

/**
 * @param jobDetail
 * @returns una descripción de oferta de trabajo sin caracteres y espacios innecesarios o que puedan perjudicar la integridad del web scrapping.
 */
export function normalizeJobDetail(jobDetail: string): string {
  return jobDetail
    .toLowerCase()
    .replace(/[(),;:]/g, ' ')
    .replace(/\//g, ' ')
    .replace(/\s+/g, ' ');
}
