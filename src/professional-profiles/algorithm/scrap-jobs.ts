import puppeteer = require('puppeteer');
import { countTechnologies as countTechnologies } from './count-technologies';
import { normalizeJobDetail } from './normalize-job-detail';
import { TechDictionary } from './types';
import { waitLoad } from './util';

const jobDetailsSelector = '#job-details';

/**
 * Implementa un algoritmo de web scraping el cual:
 *  - Extrae la descripición del trabajo.
 *  - Cuenta las tecnologías o herramientas de desarrollo de software que se mencionan en la descripición.
 *  - Estructura los datos obtenidos en un diccionarios de datos.
 * @param page
 * @param jobLinks
 * @returns - un objeto de diccionarios de tecnologias, con el número de veces que se repitió esa tecnología.
 */
export async function scrapJobs(
  page: puppeteer.Page,
  jobLinks: string[],
): Promise<TechDictionary[]> {
  console.debug('Init scrapping jobs...');

  const languagesDict: TechDictionary = {};
  const frameworksDict: TechDictionary = {};
  const librariesDict: TechDictionary = {};
  const databasesDict: TechDictionary = {};
  const architecturesDict: TechDictionary = {};
  const toolsDict: TechDictionary = {};

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
      architecturesDict,
      toolsDict,
    );
    console.debug(`Job #${index + 1} scrapped successfully`);
  }
  console.debug('Jobs scrapped successfully');

  return [
    languagesDict,
    frameworksDict,
    librariesDict,
    databasesDict,
    architecturesDict,
    toolsDict,
  ];
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
    return `${title.innerText} ${paragraph.innerText}`;
  }, jobDetailsSelector);
  console.log('Job detail obtained successfully');
  return jobDetail;
}
